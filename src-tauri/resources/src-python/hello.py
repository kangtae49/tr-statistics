import time

# fd = open('a.txt', 'a')
for i in range(10):
    print("헬로 월드", flush=True)
    # fd.write("%d\n" % i)
    time.sleep(1)
# fd.close()