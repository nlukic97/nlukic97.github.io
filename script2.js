/**Bootstrapping */
var pc = new Object();
pc['/'] = new Object() //ovo ['/'] je mozda nepotrebno
var pwd = pc['/']
var pwdPath = ['/']

var cmdHistory = []
var cmdIndex = 0;

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
    if(cmdHistory.length > 0){
        document.getElementById('terminal-textbox').value = cmdHistory[cmdIndex]
        
        cmdIndex++;
        if(cmdIndex > cmdHistory.length - 1){
            cmdIndex = 0
        }
    }   
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

document.addEventListener('keydown',e=>{
    // document.getElementById('terminal-textbox').focus()
})

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
    
    if(e.key == 'Tab' && document.getElementById('terminal-textbox').value.includes('cd ')){
        e.preventDefault()
        autofill(document.getElementById('terminal-textbox').value.substring(3))
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
        string = string + key + ' '
    });
    
    outputText(string)
}

function showFolderList(){
    var string = '';
    Object.keys(pwd).forEach(key=>{
        if(typeof(pwd[key])==='object'){
            string = string + key + ' '
        }
    });
    
    outputText(string)
}

function cd(arg){ //bug when I am in the Nikola folder.
    if(arg === '..' && pwdPath.length > 1){ //quick easy fix, but tbh I would just remove the ['/'] from the entire thing. If array is empty, we are there
        return goBack()
    }
    
    var keys = Object.keys(pwd);
    let ans = keys.includes(arg)
    
    if(ans === false){
        outputText('Error: The directory could not be found.')
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
        outputText('Hello. Welcome to my terminal. If you wanna be friends, I\'m totally down!')
        outputText('There is no real reason why I made this, seemed kinda cool.')
    } else if(cmd.includes('mkdir ')){
        addFolder(pwd,`${cmd.substring(6)}`)
    } else if(cmd.includes('rmdir ') ){
        removeFolder(pwd,cmd.substring(6)) //Does not work for some reason
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
    } else if(cmd ==='help' || cmd === '-h'){
        window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley", "_blank");
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

function autofill(string){
    let newString = string.split(' ')
    
    if(newString.length === 1){
        if(string !== '' && string[0] !== ' ' && string[string.length-1] !== ''){
            let keys = Object.keys(pwd)
            
            for(let i = 0; i < keys.length; i++){
                let ans = keys[i].match('^' + string)
                console.log(ans);
                if(ans != null){
                    if(typeof(pwd[keys[i]]) === 'string'){
                        return
                    }
                    document.getElementById('terminal-textbox').value = 'cd ' + keys[i]
                    break 
                }
            }
        } else {
            outputText(getPwdPath(),true)
            outputText('cd',false,true)
            showFolderList()
        }
    }
    
}