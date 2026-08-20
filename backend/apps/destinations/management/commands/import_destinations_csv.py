import os
from django.core.management.base import BaseCommand, CommandError
from apps.destinations.importer import DestinationCSVImporter

class Command(BaseCommand):
    help = 'Bulk import destinations from a CSV file with validation and duplicate protection.'

    def add_arguments(self, parser):
        parser.add_argument('csv_file', type=str, help='Path to the CSV file to import')
        parser.add_argument('--dry-run', action='store_true', help='Validate and preview rows without modifying the database')

    def handle(self, *args, **options):
        csv_path = options['csv_file']
        dry_run = options['dry_run']

        if not os.path.exists(csv_path):
            raise CommandError(f"CSV file not found at: {csv_path}")

        self.stdout.write(self.style.NOTICE(f"\nReading and validating CSV: {csv_path}..."))

        with open(csv_path, 'r', encoding='utf-8-sig') as f:
            importer = DestinationCSVImporter(f)
            validation_result = importer.validate()

        self.stdout.write(self.style.MIGRATE_HEADING("\n" + "=" * 60))
        self.stdout.write(self.style.MIGRATE_HEADING("CSV VALIDATION REPORT"))
        self.stdout.write(self.style.MIGRATE_HEADING("=" * 60))
        self.stdout.write(f"Total Rows:     {validation_result['total_rows']}")
        self.stdout.write(self.style.SUCCESS(f"Valid Rows:     {validation_result['valid_count']}"))
        self.stdout.write(f"  - To Create:  {validation_result['rows_to_create']}")
        self.stdout.write(f"  - To Update:  {validation_result['rows_to_update']}")
        
        if validation_result['skipped_count'] > 0:
            self.stdout.write(self.style.ERROR(f"Failed/Skipped: {validation_result['skipped_count']}"))
            self.stdout.write(self.style.WARNING("\nErrors found:"))
            for err in validation_result['errors']:
                self.stdout.write(
                    self.style.WARNING(f"  [Row {err['row']}] {err['field']}: {err['error']} (Fix: {err['suggested_fix']})")
                )

        if dry_run:
            self.stdout.write(self.style.SUCCESS("\n[DRY RUN COMPLETE] No database changes were made."))
            return

        if validation_result['valid_count'] == 0:
            self.stdout.write(self.style.ERROR("\nNo valid rows to import. Aborting."))
            return

        # Execute import
        self.stdout.write(self.style.NOTICE("\nExecuting database import..."))
        result = importer.execute_import(validation_result['valid_rows'])

        self.stdout.write(self.style.SUCCESS("\n" + "=" * 60))
        self.stdout.write(self.style.SUCCESS("IMPORT SUCCESSFUL"))
        self.stdout.write(self.style.SUCCESS("=" * 60))
        self.stdout.write(self.style.SUCCESS(f"Created: {result['created_count']} destinations"))
        self.stdout.write(self.style.SUCCESS(f"Updated: {result['updated_count']} destinations"))
        self.stdout.write(self.style.SUCCESS(f"Total:   {result['total_imported']} destinations processed successfully.\n"))
