
default: progress
	git log

git: add commit push

add:
	git add -A

commit:
	git commit -m "$(m)"

push:
	git push

pull:
	git pull