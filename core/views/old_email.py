# welcome_email


# def notify_simplify(request, email):
#     user = User.objects.get(email=email)
#     email_template = get_template("emails/template.html")
#     email_address = user.email
#     if user.first_name is not None and user.last_name is not None:
#         user_name = user.first_name + " " + user.last_name
#     else:
#         user_name = user.username
#     # tenant = get_user_tenant(request)#tenant=tenant,
#     tenant = Tenant.objects.get(pk=user.tenant.id)
#     signup_code = tenant.key
#     name = "notify.admin"

#     email_notification = EmailNotificationTemplate.objects.filter(name=name).values()
#     body = email_notification[0]["body"]
#     subject = email_notification[0]["subject"]

#     tenant_name = "Name :" + user_name
#     tenant_email = " Email :" + email_address
#     code = "Sign-up Code:" + signup_code
#     html_content = email_template.render(
#         {
#             "body": body,
#             "tenant_name": tenant_name,
#             "tenant_email": tenant_email,
#             "code": code,
#         }
#     )
#     send_asynchronous_email.delay("ayush@simplifyvms.com", subject, body, html_content)


# def partner_welcome(request, email):
#     user = User.objects.get(email=email)
#     email_template = get_template("emails/template.html")
#     email_address = user.email
#     if user.first_name is not None and user.last_name is not None:
#         user_name = user.first_name + " " + user.last_name
#     else:
#         user_name = user.username
#     # tenant = get_user_tenant(request)#tenant=tenant,
#     name = "partner.welcome"
#     email_notification = EmailNotificationTemplate.objects.filter(name=name).values()
#     body = email_notification[0]["body"]
#     subject = email_notification[0]["subject"]
#     tenant = Tenant.objects.get(pk=user.tenant.id)
#     signup_code = tenant.key
#     tenant_name = "Name :" + user_name
#     tenant_email = " Email :" + email_address
#     code = "Your organization's sign up code is " + signup_code + "."
#     html_content = email_template.render(
#         {
#             "body": body,
#             "code1": code,
#             "tenant_name1": tenant_name,
#             "tenant_email1": tenant_email,
#             "candidate_name": user_name,
#         }
#     )
#     send_asynchronous_email.delay(email_address, subject, body, html_content)


# def signup_nonprofit(request, email):
#     user = User.objects.get(email=email)
#     email_template = get_template("emails/template.html")
#     email_address = user.email
#     if user.first_name is not None and user.last_name is not None:
#         user_name = user.first_name + " " + user.last_name
#     else:
#         user_name = user.username

#     name = "signup.nonprofit"
#     email_notification = EmailNotificationTemplate.objects.filter(name=name).values()
#     body = email_notification[0]["body"]
#     subject = email_notification[0]["subject"]
#     html_content = email_template.render({"candidate_name": user_name, "body": body})
#     send_asynchronous_email.delay(email_address, subject, body, html_content)


# def signup_employer(request, email):
#     user = User.objects.get(email=email)
#     email_template = get_template("emails/template.html")
#     email_address = user.email
#     if user.first_name is not None and user.last_name is not None:
#         user_name = user.first_name + " " + user.last_name
#     else:
#         user_name = user.username
#     name = "signup.employer"
#     email_notification = EmailNotificationTemplate.objects.filter(name=name).values()
#     body = email_notification[0]["body"]
#     subject = email_notification[0]["subject"]
#     html_content = email_template.render({"candidate_name": user_name, "body": body})
#     send_asynchronous_email.delay(email_address, subject, body, html_content)


# def signup_employer_with_code(request, email):
#     user = User.objects.get(email=email)
#     # token = RefreshToken.for_user(user)
#     # relativeLink = reverse("register_email")
#     email_template = get_template("emails/template.html")
#     email_address = user.email
#     tenant = Tenant.objects.get(pk=user.tenant.id)
#     sign_upcode = tenant.key
#     if user.first_name is not None and user.last_name is not None:
#         user_name = user.first_name + " " + user.last_name
#     else:
#         user_name = user.username
#     body = "Hi, Welcome to the Career Connector powered by Simplify! We're here to help you get your skilled job seekers connect to in-demand roles with employer partners committed to building diverse and inclusive workforces and adopting skills-based hiring approaches. Your organization's sign up code is {}. Login to get started! After successful login, you will be redirected to set up a profile page and help your job seekers set up theirs in two ways:1. You can upload your job seekers profiles directly one at a time, they will receive a Welcome Email with instructions on how to sign up 2. Give your job seekers the organizationss sign up code, they can then to the site and register and create their profile If you have questions, please email support@simplifyhire.com".format(
#         sign_upcode
#     )
#     html_content = email_template.render({"candidate_name": user_name, "body": body})
#     subject = " Activate your Career Connector account"
#     send_asynchronous_email.delay(email_address, subject, body, html_content)


# set password


# data = dict((re.escape(k), v) for k, v in data.items())
# pattern = re.compile("|".join(data.keys()))
# text = pattern.sub(lambda m: data[re.escape(m.group(0))], body)
# print(text)
# uidb64 = urlsafe_base64_encode(smart_bytes(user.id))
# token = PasswordResetTokenGenerator().make_token(user)
# path = request.build_absolute_uri()
# url_parse = urlparse(path)
# base_url = url_parse.scheme + "://" + url_parse.netloc
# absurl = base_url + "/setpasswordpartner?" + "uidb64=" + uidb64 + "&" + "token=" + token + "&" + "email=" + email
# email_template = get_template("emails/action.html")
# # body = "Hi " + user.username + " Use link below to reset your password \n" + absurl
# # if user.first_name is not None and user.last_name is not None:
# #     user_name = user.first_name + " " + user.last_name
# # else:
# #     user_name = user.username

# # email_address = user.email
# name = "partner.setpassword"
# email_notification = EmailNotificationTemplate.objects.filter(name=name).values()
# body = email_notification[0]["body"]
# subject = email_notification[0]["subject"]
# message = email_notification[0]["title"]
# html_content = email_template.render(
#     {
#         "link": absurl,
#         "body": body,
#         "action_message": message,
#         "candidate_name": user_name,
#     }
# )
# send_asynchronous_email.delay(email_address, subject, body, html_content)


# def send_email_password_set(request, email, user):
#     uidb64 = urlsafe_base64_encode(smart_bytes(user.id))
#     token = PasswordResetTokenGenerator().make_token(user)
#     path = request.build_absolute_uri()
#     url_parse = urlparse(path)
#     base_url = url_parse.scheme + "://" + url_parse.netloc
#     absurl = base_url + "/setpasswordpartner?" + "uidb64=" + uidb64 + "&" + "token=" + token + "&" + "email=" + email
#     email_template = get_template("emails/action.html")
#     # body = "Hi " + user.username + " Use link below to reset your password \n" + absurl
#     if user.first_name is not None and user.last_name is not None:
#         user_name = user.first_name + " " + user.last_name
#     else:
#         user_name = user.username

#     email_address = user.email
#     name = "partner.setpassword"
#     email_notification = EmailNotificationTemplate.objects.filter(name=name).values()
#     body = email_notification[0]["body"]
#     subject = email_notification[0]["subject"]
#     message = email_notification[0]["title"]
#     html_content = email_template.render(
#         {
#             "link": absurl,
#             "body": body,
#             "action_message": message,
#             "candidate_name": user_name,
#         }
#     )
#     send_asynchronous_email.delay(email_address, subject, body, html_content)
