import sys
import json
from facebook_scraper import get_posts

post = next(get_posts(post_urls=[sys.argv[1]], cookies="src/services/cookies.txt"))
post.pop('time')
print(json.dumps(post))