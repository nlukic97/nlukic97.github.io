/**Bootstrapping */
var pc = new Object();
pc['/'] = new Object() //ovo ['/'] je mozda nepotrebno
var pwd = pc['/']
var pwdPath = ['/']

var cmdHistory = []
var cmdIndex = 0;

function addFolder(location,folderName){
    if(folderExists(location[folderName])){
        outputText('This folder already exists.')
    } else {
        location[folderName] = new Object();
    }
}

function addFile(location,filename){
    location[filename] = ''
}

function removeFolder(location,folderName){
    if(folderExists(location[folderName])){
        delete location[folderName]
    } else {
        outputText('Unable to delete non-existing file.')
    }
}

function folderExists(folder){
    if(folder){
        return true
    } else {
        return false
    }
}

function showLastCommand(){
    if(cmdHistory.length > 0){
        console.log(cmdIndex);
        console.log(cmdHistory[cmdIndex]);
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

document.addEventListener('keydown',(e)=>{
    if(e.key==='ArrowUp'){
        showLastCommand()
        console.log('arrow up');
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
        console.log(key);
        string = string + key + ' '
    });
    
    console.log(string);
    outputText(string)
}

function cd(arg){ //bug when I am in the Nikola folder.
    if(arg === '..' && pwdPath.length > 1){ //quick easy fix, but tbh I would just remove the ['/'] from the entire thing. If array is empty, we are there
        return goBack()
    }
    
    var keys = Object.keys(pwd);
    let ans = keys.includes(arg)
    if(ans === true){
        pwd = pwd[arg]
        pwdPath.push(arg)
    }
    document.getElementById('location').innerText = getPwdPath()
}

function execute(){
    let cmd = document.getElementById('terminal-textbox').value
    cmdHistory.unshift(cmd)
    
    console.log(cmdHistory);
    
    outputText(getPwdPath(),true)
    outputText(cmd)
    
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
    } else if(cmd.includes('rmdir ') ){ //WORKS THE SAME AS RM, SAME AS RMDIR
        removeFolder(pwd,cmd.substring(6)) //WORKS THE SAME AS RM, SAME AS RMDIR
    } else if(cmd.includes('rm ') ){
        removeFolder(pwd,cmd.substring(3))
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

function outputText(text,color){
    let a = document.createElement('div')
    a.innerText = text
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

    console.log(file);
    pwd[file] = string
}


function cat(file){
    if(typeof(pwd[file]) == 'string'){
        outputText(pwd[file])
    } else {
        outputText('Unable to read.')
    }
}