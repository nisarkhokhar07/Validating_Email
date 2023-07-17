from validate_email import validate_email
import sys
import json
import time
import asyncio
data = json.loads(sys.argv[1])
# print(sys.argv[1])

# email = data["Email"]

# print("Email------->", data)
# "malikhassan33.mh@gmail.com"

print(validate_email(email_address=data,check_smtp = True,check_format=True, check_dns=True, smtp_from_address='nisar.khokar@focusteck.com', smtp_helo_host='smtp.gmail.com', smtp_timeout=10, dns_timeout=10, check_blacklist=True, smtp_debug=False))
