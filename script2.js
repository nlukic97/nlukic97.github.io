/**Bootstrapping */
var pc = new Object();
pc['/'] = new Object() //ovo ['/'] je mozda nepotrebno
var pwd = pc['/']
var pwdPath = ['/']

function addFolder(location,folderName){
    location[folderName] = new Object();
}

function removeFolder(location,folderName){
    delete location[folderName]
}

addFolder(pc['/'],'users/')
addFolder(pc['/'],'bin/')
addFolder(pc['/'],'root/')

addFolder(pc['/']['users/'],'Nikola/')
addFolder(pc['/']['users/'],'Ubuntu/')

document.addEventListener('click',e=>{
    document.getElementById('terminal-textbox').focus()
})

document.addEventListener('keypress',e=>{
    document.getElementById('terminal-textbox').focus()
})

document.getElementById('terminal-textbox').focus()


document.getElementById('terminal-textbox').addEventListener('keypress',(e)=>{
    if(e.key === 'Enter'){
        execute()
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
    } else if(cmd ==='help'){
        outputText('Hello. Welcome to my terminal. If you wanna be friends, I\'m totally down!')
        outputText('There is no real reason why I made this, seemed kinda cool.')
    } else if(cmd.includes('mkdir ')){
        addFolder(pwd,`${cmd.substring(6)}/`)
    } else if(cmd.includes('rmdir ')){
        removeFolder(pwd,cmd.substring(6))
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
    return 'C:'+pwdPath.join('')
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