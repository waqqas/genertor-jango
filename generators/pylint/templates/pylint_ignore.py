"""custom solution to ignore mentioned directory in pylint"""
from pylint.utils import utils


class PylintIgnorePaths:
    """enforce pylint ignore module and directory"""

    def __init__(self, *paths):
        """set the basic config"""
        self.paths = paths
        self.original_expand_modules = utils.expand_modules
        utils.expand_modules = self.patched_expand

    def patched_expand(self, *args, **kwargs):
        """ignore the mentioned directory"""
        result, errors = self.original_expand_modules(*args, **kwargs)

        def keep_item(item):
            if any(1 for path in self.paths if path in item["path"]):
                return False

            return True

        result = list(filter(keep_item, result))

        return result, errors
