#!/usr/bin/python

import yaml

with open("./deploy/deployment.yml") as f:
    y=yaml.safe_load(f)
    y['spec']['template']['spec']['containers']['image'] = 'new_admin_pass'
    print(yaml.dump(y, default_flow_style=False, sort_keys=False))