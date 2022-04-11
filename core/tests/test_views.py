from core.tests.test_setup import TestSetUP


class TestViews(TestSetUP):
    def test_user_cannot_register(self):
        res = self.client.post(self.register_url)
        self.assertEqual(res.status_code, 400)

    def test_user_can_register(self):
        res = self.client.post(self.register_url, self.user_data, format="json")
        # self.assertEqual(res.data["email"], self.user_data["email"])
        # self.assertEqual(res.data["username"], self.user_data["username"])
        import pdb

        pdb.set_trace()
        self.assertEqual(res.status_code, 201)
