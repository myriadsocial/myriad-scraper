import sys
import json
from facebook_scraper import get_posts

print(get_posts(post_urls=[sys.argv[1]], cookies="src/services/cookies.txt"))
