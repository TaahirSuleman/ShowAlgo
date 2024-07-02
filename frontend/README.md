# ShowAlgo

## Getting Started

- Make sure you're in the correct directory
- Run ```git init```
- Run ```https://gitlab.cs.uct.ac.za/kthyus001/showalgo.git```
- Run ```git pull origin main```

## Running the Application

```
npm install
npm run dev
```

## Notes for Version Control
- On vscode, after you have pulled from main, you should create your own branch and work on that branch.
Name the branch as follows: ```featureName/yourname```, e.g codeEditorView/Yusuf. 
- You can create this using the following command in your terminal: 
```
git checkout -b featureName/yourname
```
- Do all your work on this branch
When you are ready to push your changes, make sure you are on your branch and run the following commands:

```
git add <files>
git commit -m "your commit message"
git push origin featureName/yourname
```

*Notes on the above:
- Use ```git add . ``` to add all files
- An alternative approach: Use the Source Control tab on VS Code

- Then go to gitlab and create a merge request to merge your branch with main. This will allow us to review your code before merging it with main.

***

