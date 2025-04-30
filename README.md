# IS215-FinalProject-GroupC

Hi fellow MIS students of University of the Philippines Open University! Welcome to the final project repository of Group C for IS215 - Advanced Computer Systems. This is the result of our hard work and collaboration to achieve an article generator using the following technologies:

- AWS EC2
- AWS S3 Bucket
- AWS Lambda
- ChatGPT API
- AWS Rekognition

If you need to store Client ID, Client Secret Keys, and API Keys as specified in the project specifications' **IMPORTANT REMINDERS** section, please message **Don Davis Arroyo** or **Dayvie Laparan**. Programmers must use **dotenv** instead of typing the IDs and Keys as variables to avoid compromising the security of the API.

## Git Commands for Commit, Push, and Pull

Below are the commands for basic Git operations:

1. **git status**
   - Files that are tracked and recognized as not present in the repository will glow red. Otherwise, if up to date, green.

2. **git add <filename.ext>**
   - This will add the tracked files to staging, preparing the file to be committed and pushed.

3. **git commit -m "Message / Remarks here"**
   - Adds a comment/message for the file for each member's visibility. Please use this always so we know what was the last update, aside from inserting comments in your code.

4. **git push origin main**
   - Pushes the staged file to the GitHub repository online at the main branch. Branch 'main' is what we are using, but we can change it if we are using other environments such as DEV, UAT, and QA.

5. **git pull**
   - Pulls the files from the online GitHub repository. This is recommended if you want to make sure that you have the latest file committed by your peers.

6. **git reset**
   - Unstages the file.

7. **git restore <filename.ext>**
   - Undoes changes you have made to the file.

## Common Bash Commands

Here are some common bash commands that you may find useful:

1. **PWD**
   - Present Working Directory; will display your current path.

2. **ls -la**
   - Lists all the files under the present working directory.

3. **cd <Path/Directory>**
   - Change Directory; go to the folder or path you desire.

4. **touch <filename or filename.ext>**
   - Creates a new file.

5. **nano <filename or filename.ext>**
   - Modifies or writes into the file (Best for `.txt`, `.config`, `.docx`, etc.).

6. **cat <filename or filename.ext>**
   - Displays the content of the file.

7. **mkdir <Folder Name>**
   - Creates a folder inside the present working directory.
