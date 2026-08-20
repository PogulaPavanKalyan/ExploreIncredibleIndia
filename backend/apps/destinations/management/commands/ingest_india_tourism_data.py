import os
from django.core.management.base import BaseCommand, CommandError
from apps.destinations.ingestion import IndiaTourismDataPipeline

class Command(BaseCommand):
    help = 'Ingest India tourism destinations from JSON or CSV with strict validation, duplicate detection, and quality scoring.'

    def add_arguments(self, parser):
        parser.add_argument('file_path', type=str, help='Path to the JSON or CSV file')
        parser.add_argument('--format', type=str, choices=['auto', 'json', 'csv'], default='auto', help='Format type')
        parser.add_argument('--dry-run', action='store_true', help='Validate and classify records without modifying the database')
        parser.add_argument('--auto-publish', action='store_true', help='Automatically mark complete records as published')

    def handle(self, *args, **options):
        file_path = options['file_path']
        format_type = options['format']
        dry_run = options['dry_run']
        auto_publish = options['auto_publish']

        if not os.path.exists(file_path):
            raise CommandError(f"Data file not found at: {file_path}")

        self.stdout.write(self.style.NOTICE(f"\nInitializing Data Ingestion Pipeline for: {file_path}"))

        pipeline = IndiaTourismDataPipeline()

        with open(file_path, 'r', encoding='utf-8-sig') as f:
            raw_content = f.read()

        records = pipeline.parse_input(raw_content, format_type=format_type)
        self.stdout.write(f"Parsed {len(records)} incoming records. Running validation & duplicate analysis...")

        analysis = pipeline.validate_and_classify(records)
        counts = analysis['counts']

        self.stdout.write(self.style.MIGRATE_HEADING("\n" + "=" * 65))
        self.stdout.write(self.style.MIGRATE_HEADING("INDIA TOURISM DATA INGESTION REPORT"))
        self.stdout.write(self.style.MIGRATE_HEADING("=" * 65))
        self.stdout.write(f"Total Incoming Records:      {counts['total']}")
        self.stdout.write(self.style.SUCCESS(f"  • New Destinations:        {counts['new']}"))
        self.stdout.write(self.style.NOTICE(f"  • Existing Updates:        {counts['updates']}"))
        self.stdout.write(self.style.WARNING(f"  • Possible Duplicates:     {counts['possible_duplicates']}"))
        if counts['invalid'] > 0:
            self.stdout.write(self.style.ERROR(f"  • Invalid / Error Rows:    {counts['invalid']}"))

        # Details on possible duplicates
        dup_rows = [r for r in analysis['rows'] if r.get('classification') == 'POSSIBLE_DUPLICATE']
        if dup_rows:
            self.stdout.write(self.style.WARNING("\nPossible Duplicate Warnings (Flagged for Admin Review):"))
            for r in dup_rows:
                self.stdout.write(self.style.WARNING(f"  [!] '{r.get('name')}' ({r.get('state_obj').name if r.get('state_obj') else ''}): {r.get('match_reason')}"))

        # Details on invalid rows
        if analysis['errors']:
            self.stdout.write(self.style.ERROR("\nValidation Errors:"))
            for err in analysis['errors']:
                self.stdout.write(self.style.ERROR(f"  [X] {err}"))

        if dry_run:
            self.stdout.write(self.style.SUCCESS("\n[DRY RUN COMPLETE] Zero database changes were committed.\n"))
            return

        if counts['new'] == 0 and counts['updates'] == 0:
            self.stdout.write(self.style.ERROR("\nNo valid new or updateable records to ingest. Aborting."))
            return

        # Execute Ingestion
        self.stdout.write(self.style.NOTICE("\nExecuting transaction-safe database ingestion..."))
        result = pipeline.execute_ingestion(analysis['rows'], auto_publish=auto_publish, user_name='CLI Pipeline')

        self.stdout.write(self.style.SUCCESS("\n" + "=" * 65))
        self.stdout.write(self.style.SUCCESS("INGESTION COMPLETED SUCCESSFULLY"))
        self.stdout.write(self.style.SUCCESS("=" * 65))
        self.stdout.write(self.style.SUCCESS(f"Created:  {result['created']} destinations"))
        self.stdout.write(self.style.SUCCESS(f"Updated:  {result['updated']} destinations"))
        self.stdout.write(self.style.WARNING(f"Skipped:  {result['skipped']} destinations (Invalid / Pending Review)"))
        self.stdout.write(self.style.SUCCESS(f"Total:    {result['total_processed']} destinations committed.\n"))
