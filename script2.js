var pc = new Object();
pc['/'] = new Object()
//ovo ['/'] je mozda nepotrebno
var pwd = pc['/']
var pwdPath = ['/']

document.getElementById('terminal-textbox').addEventListener('keypress',(e)=>{
    if(e.key === 'Enter'){
        execute()
    } 
})

//-------------------


function addFolder(location,folderName){
    location[folderName] = new Object();
}

addFolder(pc['/'],'users')
addFolder(pc['/'],'bin')
addFolder(pc['/'],'root')

addFolder(pc['/']['users'],'Nikola')
addFolder(pc['/']['users'],'Ubuntu')

function ls(){
    var string = '';
    Object.keys(pwd).forEach(key=>{
        console.log(key);
        string = string + key + ' '
    });

    console.log(string);
    let a = document.createElement('p')
    a.innerText = 'root@mySite ' + string
    a.classList.add('text-color')
    document.body.appendChild(a)
}

function cd(arg){
    if(arg === '..' && pwdPath.length > 1){ //quick easy fix, but tbh I would just remove the ['/'] from the entire thing. If array is empty, we are there
        return goBack()
    }

    var keys = Object.keys(pwd);
    let ans = keys.includes(arg)
    if(ans === true){
        pwd = pwd[arg]
        pwdPath.push(arg)
    }

}

function execute(){
    let cmd = document.getElementById('terminal-textbox').value

    if(cmd === 'ls'){
        ls()
    } else if(cmd.includes('cd ')){
        cmd = cmd.substring(3)
        cd(cmd)
    }

    document.getElementById('terminal-textbox').value = ''
}

function goBack(){
    pwdPath.pop()
    pwd = pc //reset

    pwdPath.forEach(e=>{
        console.log(e);
        pwd = pwd[e]
    })
}