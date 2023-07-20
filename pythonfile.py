from validate_email import validate_email
import sys
import json
data = json.loads(sys.argv[1])

try:
    print(validate_email(email_address=data,check_smtp = True,check_format=True, check_dns=True, smtp_from_address='', smtp_helo_host='smtp.gmail.com', smtp_timeout=10, dns_timeout=10, check_blacklist=True, smtp_debug=True))
except:
    print("python file cannot validate email")