import os
import django
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.destinations.models import Destination

def fix_database():
    broken_dests = Destination.objects.filter(state__isnull=True) | Destination.objects.filter(main_image='')
    count = broken_dests.count()
    if count > 0:
        print(f"Found {count} broken destinations. Deleting them to fix UI grids...")
        broken_dests.delete()
        print("Deleted.")
    else:
        print("No broken destinations found.")

if __name__ == "__main__":
    fix_database()
