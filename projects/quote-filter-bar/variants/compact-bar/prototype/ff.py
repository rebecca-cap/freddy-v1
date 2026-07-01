import subprocess
import sys


# branches can be excluded using --exclude [<branch1>, <branch2>, ...]
branches_to_reset = ["osp_test", "osp_dev", "osp_demo", "dev", "test"]

if "--exclude" in sys.argv:
    branches_to_reset = [branch for branch in branches_to_reset if branch not in sys.argv[sys.argv.index("--exclude") + 1:]]

if "--resync-local" in sys.argv:
    for branch in [*branches_to_reset, "main"]:
        subprocess.run(["git", "checkout", branch], stdout=subprocess.DEVNULL)
        subprocess.run(["git", "reset", "--hard", "origin/" + branch], stdout=subprocess.DEVNULL)

    print("Local branches have been reset to their remote counterparts.")
    exit(0)

# a target branch can be supplied with --target <branch>
branch_to_reset_to = "main"
if "--target" in sys.argv:
    branch_to_reset_to = sys.argv[sys.argv.index("--target") + 1]


print(f"The following branches will be reset to branch <{branch_to_reset_to}>:\n" + str(branches_to_reset))

confirmation = input(f'Are you sure? (y/n)\n')

if confirmation != "y":
    print("Aborting...")
    exit(0)


for branch in branches_to_reset:
    subprocess.run(["git", "checkout", branch], stdout=subprocess.DEVNULL)
    subprocess.run(["git", "reset", "--hard", branch_to_reset_to], stdout=subprocess.DEVNULL)
    subprocess.run(["git", "push", "--force", "origin", branch], stdout=subprocess.DEVNULL)




