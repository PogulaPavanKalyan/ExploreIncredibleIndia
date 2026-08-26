import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
django.setup()

def run_all_seeders():
    print("=== STARTING FULL DATABASE SEEDING FOR EXPLORE INCREDIBLE INDIA ===")
    
    # 1. Seed Production Destinations (Regions, States, Cities, Categories, Activities, Destinations)
    try:
        print("\n[1/4] Running seed_production_destinations.py...")
        import seed_production_destinations
    except Exception as e:
        print(f"Error in seed_production_destinations: {e}")

    # 2. Seed Collections
    try:
        print("\n[2/4] Running seed_collections.py...")
        import seed_collections
    except Exception as e:
        print(f"Error in seed_collections: {e}")

    # 3. Seed Experiences
    try:
        print("\n[3/4] Running seed_experiences.py...")
        import seed_experiences
    except Exception as e:
        print(f"Error in seed_experiences: {e}")

    # 4. Seed Stories
    try:
        print("\n[4/4] Running seed_stories.py...")
        import seed_stories
    except Exception as e:
        print(f"Error in seed_stories: {e}")

    print("\n=== FULL DATABASE SEEDING COMPLETED SUCCESSFULLY ===")

if __name__ == '__main__':
    run_all_seeders()
