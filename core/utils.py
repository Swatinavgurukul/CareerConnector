from core.helpers import send_simple_message


class Util:
    @staticmethod
    def send_email(data):
        send_simple_message(data["to_email"], data["email_subject"], data["email_body"])
        # email.send()
