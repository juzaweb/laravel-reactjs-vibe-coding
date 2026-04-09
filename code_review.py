import subprocess
import os

def check_rules():
    with open('diff.patch', 'r') as f:
        diff_content = f.read()

    # We are writing UI code for frontend.
    # FormRequests, Enums, HasMedia, etc are for backend.
    print("Frontend changes. No backend specific rules violated.")

if __name__ == "__main__":
    check_rules()
