import string
import random
from django.utils.text import slugify


def random_string_generator(size=6, chars=string.ascii_lowercase + string.digits):
    return "".join(random.choice(chars) for _ in range(size))


def unique_slug_generator(instance, new_slug=None):

    if new_slug is not None:
        slug = new_slug
    else:
        if instance.title:
            slug = slugify(instance.title)
        elif instance.title_esp:
            slug = slugify(instance.title_esp)
        else:
            slug = slugify(instance.title_fr)

    Klass = instance.__class__
    qs_exists = Klass.objects.filter(slug=slug).exists()
    if qs_exists:
        new_slug = slug + "-" + random_string_generator(size=6)
        # new_slug = "{slug}-{randstr}".format(slug=slug, randstr=random_string_generator(size=6))
        return unique_slug_generator(instance, new_slug=new_slug)
    return slug
