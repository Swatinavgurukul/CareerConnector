import datetime
import base64
from directsourcing.settings import MEDIA_ROOT


def base64ToPdf(byt, user):
    if user.resume_file == "" or user.resume_file is None:
        pdf_name = user.username
        timestamp = datetime.datetime.now().timestamp()
        int_time = str(int(timestamp))
        output_path = str(MEDIA_ROOT) + "resume/" + pdf_name + "_" + int_time + ".pdf"

        with open(output_path, "wb") as theFile:
            theFile.write(base64.b64decode(byt))
            theFile.close()

        user.resume_file = "resume/" + pdf_name + "_" + int_time + ".pdf"
        user.save()
        return True
    else:
        return False