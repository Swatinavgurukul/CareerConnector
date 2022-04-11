from mongoengine import IntField, StringField, DateTimeField, Document


class Audit(Document):
    user_id = IntField(null=False)
    table_name = StringField(null=False)
    table_row = StringField(null=False)
    data = StringField(null=False)
    action = StringField(null=False)
    date = DateTimeField(auto_now_add=True)
    tenant_id = IntField(null=False)