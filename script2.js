/**Bootstrapping */
var pc = new Object();
pc['/'] = new Object() //ovo ['/'] je mozda nepotrebno
var pwd = pc['/']
var pwdPath = ['/']

var cmdHistory = []
var cmdIndex = 0;
var lastArrowWasUp = null;

function addFolder(location,folderName){
    if(folder_file_exists(location[folderName])){
        outputText('This folder already exists.')
    } else {
        location[folderName] = new Object();
    }
}

function addFile(location,filename){
    if(folder_file_exists(location[filename])){
        outputText('This name is already taken by a file or a folder.')
    } else {
        location[filename] = ''
    }
}

function removeFolder(location,folderName){
    console.log(location[folderName]);
    if(folder_file_exists(location[folderName]) && typeof(location[folderName]) === 'object'){
        delete location[folderName]
    } else {
        outputText('Unable to delete non-existing folder.')
    }
}

function removeFile(location,fileName){
    if(typeof(location[fileName]) === 'string'){
        
        delete location[fileName]
    } else {
        outputText('Unable to delete non-existing file.')
    }
}

function folder_file_exists(folder){
    if(folder){
        return true
    } else {
        return false
    }
}

function showLastCommand(){
    console.log(cmdHistory, cmdIndex);
    if(cmdHistory.length > 0){

        if(lastArrowWasUp === false){
            cmdIndex += 1
        }

        if(cmdIndex < 0 || cmdIndex > cmdHistory.length - 1){
            cmdIndex = 0
        }
        
        document.getElementById('terminal-textbox').value = cmdHistory[cmdIndex]
        
        cmdIndex++;
        if(cmdIndex > cmdHistory.length - 1){
            cmdIndex = 0
        }
    }   
    lastArrowWasUp = true
}

function showPreviousCommand(){
    console.log(cmdHistory, cmdIndex);

    if(cmdHistory.length > 0){
        if(lastArrowWasUp === true){
            cmdIndex -= 2
        } else {
            cmdIndex -= 1;
        }
        
        if(cmdIndex < 0){
            cmdIndex = cmdHistory.length - 1
        }
        document.getElementById('terminal-textbox').value = cmdHistory[cmdIndex]
    }   
    lastArrowWasUp = false
}

addFolder(pc['/'],'users')
addFolder(pc['/'],'bin')
addFolder(pc['/'],'root')

addFolder(pc['/']['users'],'Nikola')
addFolder(pc['/']['users'],'Ubuntu')

addFile(pc['/'],'txt')

document.addEventListener('click',e=>{
    document.getElementById('terminal-textbox').focus()
})

// document.addEventListener('keydown',e=>{
    // document.getElementById('terminal-textbox').focus()
// })

document.getElementById('terminal-textbox').focus()


document.getElementById('terminal-textbox').addEventListener('keypress',(e)=>{
    if(e.key === 'Enter'){
        execute()
    }
})

document.getElementById('terminal-textbox').addEventListener('keydown',(e)=>{
    if(e.key==='ArrowUp'){
        showLastCommand()
    }

    if(e.key==='ArrowDown'){
        showPreviousCommand()
    }
    
    if(e.key == 'Tab'){
        e.preventDefault()
        let val = document.getElementById('terminal-textbox').value
        if(val.includes('cd ')){
            autofill(val,val.substring(3),true)
        } else if(val.includes('rm ')){
            autofill(val, val.substring(3),false)
        } else if(val.includes('rmdir ')){
            autofill(val, val.substring(6),true)
        }
    }
})


document.getElementById('location').innerText = getPwdPath()

// ---------------------------------------------------------------------------

/**Functions */
function scrollToBottom(){
    window.scrollTo(0,document.body.scrollHeight);
}

function ls(){
    var string = '';
    Object.keys(pwd).forEach(key=>{
        if(typeof(pwd[key])==='object'){
            string = string + key + '/ '
        } else {
            string = string + key + ' '
        }
    });
    
    outputText(string)
}

function showFolderList(){
    getNecessaryList('object')
}

function showFileList(){
    getNecessaryList('string')
}


/**Utility function for showing folders and files */
function getNecessaryList(fileType){
    var string = '';

    Object.keys(pwd).forEach(key=>{
        if(typeof(pwd[key]) === fileType){
            
            if(fileType === 'object'){
                string = string + key + '/ '
            } else if(fileType === 'string'){
                string = string + key + ' '
            }
        }
    });
    
    outputText(string)
}

function cd(arg){ //bug when I am in the Nikola folder.
    arg = arg.replace('/','')
    if(arg === '..' && pwdPath.length > 1){ //quick easy fix, but tbh I would just remove the ['/'] from the entire thing. If array is empty, we are there
        return goBack()
    }
    
    var keys = Object.keys(pwd);
    let ans = keys.includes(arg)
    
    if(ans === false){
        if(arg !== '..'){
            outputText('Error: The directory could not be found.')
        }
        return
    }
    
    if(typeof(pwd[arg]) === 'string'){
        outputText('Error: The directory name is invalid.')
        return
    }
    
    if(ans === true){
        pwd = pwd[arg]
        pwdPath.push(arg)
    }
    document.getElementById('location').innerText = getPwdPath()
}

function execute(){
    let cmd = document.getElementById('terminal-textbox').value
    cmdHistory.unshift(cmd)
    
    outputText(getPwdPath(),true)
    outputText(cmd,false,true)
    
    if(cmd === 'ls'){
        ls()
    } else if(cmd.includes('cd ')){
        cmd = cmd.substring(3)
        cd(cmd)
    } else if(cmd === 'clear'){
        clearTerminal()
    } else if(cmd === 'pwd'){
        outputText(getPwdPath())
    } else if(cmd ==='about'){
        outputText('Hello. My name is Nikola, and this is my terminal simulation. It is heavily inspired by the terminal emulator \'cmder\'.')
        outputText('There is no real reason why I made this, just seemed like something cool to try.')
        outputText('Type in <span class=\'info-color\'>help</span> to see a list of available commands.')
    } else if(cmd.includes('mkdir ')){
        addFolder(pwd,`${cmd.substring(6)}`)
    } else if(cmd.includes('rmdir ') ){
        removeFolder(pwd,cmd.substring(6).replace('/',''))
    } else if(cmd.includes('rm ') ){
        removeFile(pwd,cmd.substring(3))
    } else if(cmd.includes('echo ') && cmd.includes(' > ')){
        saveTextToFile(cmd)
        
    } else if(cmd.includes('touch ')){
        addFile(pwd,cmd.substring(6))
    } else if(cmd.includes('echo ')){
        outputText(cmd.substring(5))
    } else if(cmd.includes('cat ')){
        cat(cmd.substring(4))
    } else if(cmd === 'exit'){
        window.close()
    } else if(cmd ==='info'){
        window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley", "_blank");

        setTimeout(function(){
            outputText(getPwdPath(),true)
            outputText('&lambda; lol.')
            outputText('&lambda; You should type in <span class=\'info-color\'>about</span> instead.')
        },2000)
    } else if(cmd === 'help'){
        outputText(`
       <div>&lambda;</div> 

       <div>help - <em>shows all the commands<</em>/div> 

       <div>info - <em>you already know...</em></div>

       <div>about - <em>Just some info on this little project of mine. :) </em></div>
        
       <div>echo [text] - <em>Prints text to the terminal<</em>/div> 

       <div>ls - <em>Prints files and folders in the current working diretory.</em></div>

       <div>pwd - <em>Prints the current path you are in.</em></div>

       <div>clear - <em>clears the terminal screen</em></div>

       <div>arrow up - <em>shows previously executed commands</em></div>

       <div>cd [folder] - <em>enters a directory</em></div>

       <div>cd - <em>lists all the folders in the current working directory</em></div>

       <div>mkdir [dirname] - <em>creates a directory</em></div>

       <div>rmdir [dirname] - <em>removes a directory</em></div>

       <div>touch [filename] - <em>create a file (text)</em></div>

       <div>rm [filename] - <em>remove a file</em></div>

       <div>cat [filename] - <em>read the contents of a file</em></div>

       <div>echo [string] > [filename] - <em>writes a string to a file. it will create a file if it does not exist, and overwrite existing ones.</em></div>

       `)
    //    <div>exit - <em>it will close the terminal (browser) window</em></div> //does not work
    }
    
    else {
        outputText('Unrecognized command.')
    }
    
    document.getElementById('terminal-textbox').value = ''
    scrollToBottom()
}

function goBack(){
    pwdPath.pop()
    pwd = pc //reset
    
    pwdPath.forEach(e=>{
        console.log(e);
        pwd = pwd[e]
    })
    
    document.getElementById('location').innerText = getPwdPath()
}

function clearTerminal(){
    let number = document.getElementsByClassName('output').length
    let deleted = 0
    
    while(deleted < number){
        document.getElementsByClassName('output')[0].remove()
        deleted++
    }
}

function getPwdPath(){
    return 'C:'+pwdPath.join('/').replace('/','')
}

function outputText(text,color,cmd){
    let a = document.createElement('div')
    
    if(cmd === true){
        a.innerHTML = '&lambda; '+text
    } else {
        a.innerHTML = text
    }
    
    if(color === true){
        a.classList.add('location-color')
    } else {
        a.classList.add('text-color')
    }
    a.classList.add('output')
    
    document.getElementById('output-container').append(a)
}

function saveTextToFile(cmd){
    
    let a = cmd.trim().split(' ')
    if(a[a.length-2] != '>'){
        return outputText('Error')
    }
    var string = ''
    
    let file = a[a.length - 1]

    //checking if file already exists
    if(typeof(pwd[file]) === 'object'){
        outputText('Error: A folder with this name already exists.')
        return
    }

    a.forEach((item,index)=>{
        if(index != 0 && index < a.length - 2){
            string += ' ' + item
        }
    })
    
    pwd[file] = string
}


function cat(file){
    if(typeof(pwd[file]) == 'string'){
        outputText(pwd[file],false,true)
    } else {
        outputText('Unable to read.')
    }
}

function autofill(enteredCmd,string,folderCommand){
    let newString = string.split(' ')
    
    if(newString.length === 1){
        if(string !== '' && string[0] !== ' ' && string[string.length-1] !== ''){
            let keys = Object.keys(pwd)
            let criteria = (folderCommand === true) ? 'object' : 'string';

            for(let i = 0; i < keys.length; i++){
                let ans = keys[i].match('^' + string)
                console.log(ans);

                if(ans != null){
                    if(typeof(pwd[keys[i]]) !== criteria){
                        return
                    }
                    let autocomplete = enteredCmd.split(' ')[0] + ' ' + keys[i]

                    if(criteria === 'object'){
                        autocomplete += '/'
                    }
                    document.getElementById('terminal-textbox').value = autocomplete

                    break 
                }
            }
        } else {
            outputText(getPwdPath(),true)
            outputText(enteredCmd,false,true)

            if(folderCommand === true){
                showFolderList()
            } else {
                showFileList()
            }
        }
    }

}

function startSequence(){
    setTimeout(function(){
        outputText(getPwdPath(),true)
        outputText('&lambda; Hello Neo.')
    },2000)
    
    setTimeout(function(){
        outputText(getPwdPath(),true)
        outputText('&lambda; We have been expecting you.')
    },3700)
    
    setTimeout(function(){
        outputText(getPwdPath(),true)
        outputText('<span class=\'text-color\'>&lambda;</span> Type <span class="info-color">info</span> to learn more about this project.')
        document.getElementById('d-none').removeAttribute('id','d-none')
        document.getElementById('terminal-textbox').focus()
    },6000)
}

function checkForCookie(cookieName){
    let cookies = document.cookie.split('; ')

    for(let i =0; i < cookies.length; i++){
        if(cookies[i].includes(cookieName)){
            let result = cookies[i].replace(cookieName+'=','')
            return (result == 'true')? true : false;
            break
        }
    }
}

    if(checkForCookie('matrixShown') === true){
        document.getElementById('d-none').removeAttribute('id','d-none')
    } else {
        startSequence()
        document.cookie = 'matrixShown=true'
    }


    //github pages