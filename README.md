# IS215-FinalProject-GroupC
Hi fellow MIS students of University of the Philippines Open University! Welcome to the final project repository of Group C for IS215 - Advanced Computer Systems.   This is the result of our hardwork and collaboration to achieve an article generator using the following:  
•	AWS EC2 
•	AWS S3 Bucket 
•	AWS Lambda 
•	ChatGPT API 
•	AWS Rekognition

If you need to store Client ID, Client Secret Keys, and API Keys as specified on the project specifications' IMPORTANT REMINDERS section, please message Don Davis Arroyo or Dayvie Laparan. Programmers must use 'dotenv' instead of typing the IDs and Keys as variable because it might affect the security of the API. 

For Commit, Push, and Pull, you may refer to the following commands below:

1.) git status 
-	files that are tracked and recognized as not present in the repository will glow red. Otherwise, if up to date, green.
2.) git add <filename.ext>
-	will put the tracked files to staging, preparing the file to be committed and pushed.
3.) git commit -m "Message / Remarks here"
-	will put a comment / message for the file for each members' visibility. Please use this always so we know what was the last update aside from inserting comments in your code.
4.) git push origin main
-	will push the staged file into the github repository online at the main branch. Branch 'main' is what we are using. We can change it if we are using other environments such as DEV, UAT, and QA.
-	
5.) git pull
-	will pull the files from the online github repository. This is recommended if you want to make sure that you have the latest file committed by your peers.
6.) git reset
-	will unstage the file.
7.) git restore <filename.ext>
-	if you want to undo changes you have made from the file.

Common Bash Commands:
1.)	PWD - Present Working Directory; Will display your current path.
2.)	ls -la Will list all of the files under the present working directory.
3.)	cd <Path/Directory> - ChangeDirectory / go to the folder or path you desire. 
4.)	touch <filename or filename.ext> - create file.
5.)	nano <filename or filename.ext> - Modify / Write into the file. (Best for .txt, .config, .docx etc.)
6.)	cat <filename or filename.ext> - display the content of the file.
7.)	mkdir <Folder Name> - creates a folder inside the PWD
8.)	rm <filename or filename.ext> - removes or deletes the specified file.
