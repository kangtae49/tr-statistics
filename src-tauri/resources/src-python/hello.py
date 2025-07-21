import os
import sys
import time
import random
import csv



print(sys.argv[1:])
def main():
    data = [
        ["1월", random.randint(100, 500)],
        ["2월", random.randint(100, 500)],
        ["3월", random.randint(100, 500)],
        ["4월", random.randint(100, 500)],
        ["5월", random.randint(100, 500)],
        ["6월", random.randint(100, 500)],
    ]
    args = sys.argv[1:]
    if len(args) == 0:
        print("No Save File", file=sys.stderr)
        return
    save_file = args[0]
    temp_save_file = save_file + ".tmp"

    for i in range(10):
        print(f"Step_{i+1}", flush=True)
        # fd.write("%d\n" % i)
        time.sleep(1)

    with open(temp_save_file, "w", newline='', encoding="utf-8") as fd:
        writer = csv.writer(fd, delimiter='\t', lineterminator='\n')
        writer.writerows(data)

    if os.path.exists(save_file):
        os.remove(save_file)
    os.rename(temp_save_file, save_file)
if __name__ == "__main__":
    main()