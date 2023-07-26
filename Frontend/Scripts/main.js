let token=localStorage.getItem("rajChatAppToken")
token=JSON.parse(token)
if(!token){
    window.location='login.html'
}

let myProfile=document.getElementById("profile")
let midCenterPart= document.getElementById("mid-center-part")
let sidePanel=document.getElementById("mySidepanel")
let openBtn= document.getElementById("myopenbtn")
let defaultProfilLink="./Images/profile_pic.avif"
let linkFromDB


myProfile.addEventListener("click",(e)=>{
    sidePanel.style.width = "0";
    openBtn.style.display='block'
   showMiddlePart()
})

function showMiddlePart(){
    midCenterPart.innerHTML=`
    <div id="profile-show-div">
            <h1 id="myProfhead">My Profile</h1>
        <div id="profilepic">
        </div>
        <div id="user-info">
            <div id="user-name-div">
                <div class="info-div">
                    <label for="">Name:</label>
                </div>
                <div class="value-div" id="nameupdiv">
                    <input type="text" id="profilename"  value="testing" readonly>
                    <div id="nameupbtndiv">
                        
                    </div>
                </div>
            </div>
            <div id="user-email-div">
                <div class="info-div">
                    <label for="">Email:</label>
                </div>
                <div class="value-div">
                    <input type="Email" id="profileemail"  value="testing@gmail.com"readonly>
                </div>
            </div>
            <div id="user-mobile-div">
                <div class="info-div">
                    <label for="">Mobile:</label>
                </div>
                <div class="value-div" id="mobileupdiv">
                    <input type="text" id="profilemobile"  value="8080680231"readonly>
                    <div id="mobileupbtndiv">
                       
                    </div>
                </div>
            </div>
            <div id="user-dob-div">
                <div class="info-div">
                    <label for="">DOB:</label>
                </div>
                <div class="value-div">
                    <input type="date" id="profiledob"  value="2018-07-22" readonly>
                </div>
            </div>
            <div id="user-status-div">
                <div class="info-div">
                    <label for="">Status:</label>
                </div>
                <div class="value-div" id="statusupdiv">
                    <input type="text" id="profilestatus"  value="Yes" readonly>
                    <div id="statusupbtndiv">
                        
                    </div>
                    
                </div>
            </div>
            <div id="user-password-div">
                <div class="password-key-div">
                    <label for="">Password</label>
                </div>
                <div class="password-div">
                    <form>
                        <input type="password" id="oldpass" placeholder="Enter Old Password" autocomplete="off" required>
                        <input type="password" id="newpass" placeholder="Enter New Password" autocomplete="off" required>
                        <button id="passup">Update</button>
                    </form>
                </div>
            </div>
            
        </div>
        </div>
    `
let profilepic=document.getElementById("profilepic")
    
//change
// loadProfilePic(defaultProfilLink)
getProfileLink()


//nameupdate
let nameupdiv=document.getElementById("nameupdiv")
let profilename=document.getElementById("profilename")
let nameupbtndiv=document.getElementById("nameupbtndiv")
nameupbtnshow(nameupdiv,profilename,nameupbtndiv)


//mobileupdate
let mobileupdiv=document.getElementById("mobileupdiv")
let profilemobile=document.getElementById("profilemobile")
let mobileupbtndiv=document.getElementById("mobileupbtndiv")
mobileupbtnshow(mobileupdiv,profilemobile,mobileupbtndiv)

//statusupdate
let statusupdiv=document.getElementById("statusupdiv")
let profilestatus=document.getElementById("profilestatus")
let statusupbtndiv=document.getElementById("statusupbtndiv")
statusupbtnshow(statusupdiv,profilestatus,statusupbtndiv)

}



function loadProfilePic(link){
    let tempLink
    if(link=='NA'){
        tempLink="NA"
        link=defaultProfilLink
    }else{
        tempLink=link
    }
    profilepic.style.flexDirection='column'
    profilepic.innerHTML=`
    <img src="${link}" alt="">
    <button id="upProfilePic">Update Profile Picture</button>
    `
    let upProfilebtn=document.getElementById("upProfilePic")
    upProfilebtn.addEventListener("click",(e)=>{
            upLoadProfilPic(tempLink)
    })
   
}

function upLoadProfilPic(link){
    profilepic.innerHTML=''
    profilepic.style.flexDirection='row'
    // profilepic.style.padding='10px'
    profilepic.innerHTML=`
    <input type="text" id="newprofilelinke" placeholder="Enter valid link of your profile" value=${link}>
    <button id="saveProfilebtn">Save</button>
    <button id="cancelProfilebtn">Cancel</button>
    `
    let newprofilelinke=document.getElementById("newprofilelinke")
    let saveProfilebtn=document.getElementById("saveProfilebtn")
    let cancelProfilebtn=document.getElementById("cancelProfilebtn")
    saveProfilebtn.addEventListener("click",(e)=>{
        let profile=newprofilelinke.value
        if(profile.length==0 || profile=="NA"){
            alert("Please Enter Valid Link.")
        }else{
            let obj={
                profileLink:profile
            }
            updateProfileLink(obj)
        }
    })
    cancelProfilebtn.addEventListener("click",(e)=>{
        profilepic.style.flexDirection='column'
        loadProfilePic(linkFromDB)
    })
}




async function getProfileLink(){
    try {
        let url=await fetch("http://localhost:8000/user/profile/link",{
        method:"GET",
        headers:{
            "Content-Type": "application/json",
            "authorization":`Bearer ${token}`
        }
    })
    let resData=await url.json()
    if(url.status==401 || url.status==400){
        await swal("ERROR!", `${resData.message}`, "error");
    }else{
        let link=resData.profile
        if(link=='NA'){
            loadProfilePic(link)
        }else{
            linkFromDB=link
            loadProfilePic(link)
        }
    }
    } catch (error) {
        console.log(error.message)
        await swal("Server Error!", "Sorry :(, There is error in Server!", "error");
    }
}

async function updateProfileLink(obj){
try {
    let url=await fetch("http://localhost:8000/user/update/profilepic",{
        method:"PATCH",
        headers:{
            "Content-Type": "application/json",
            "authorization":`Bearer ${token}`
        },
        body:JSON.stringify(obj)
    })
    let resData=await url.json()
    if(url.status==400 || url.status==401){
        await swal("ERROR!", `${resData.message}`, "error");
    }else{
        await swal("Successfull!", `${resData.message}`, "success");
        loadProfilePic(resData.profileLink)
    }
    
} catch (error) {
        console.log(error.message)
        await swal("Server Error!", "Sorry :(, There is error in Server!", "error");
} 
}


function nameupbtnshow(nameupdiv,profilename,nameupbtndiv){
    nameupbtndiv.innerHTML=`
    <button id="nameup">Update</button>
    `
    let nameup=document.getElementById("nameup")
    nameup.addEventListener('click',(e)=>{
       profilename.removeAttribute("readonly")
       profilename.style.backgroundColor="white"
         nameSaveOrCancel(nameupdiv,profilename,nameupbtndiv)
    })
}

function nameSaveOrCancel(nameupdiv,profilename,nameupbtndiv){
    nameupbtndiv.innerHTML=``
        nameupbtndiv.innerHTML=`
        <button id="correctname"> &#10004;</button>
        <button id="cancelname"> &#10006;</button>
        `
        let correctname=document.getElementById("correctname")
        let cancelname=document.getElementById("cancelname")
        correctname.style.marginRight='5px'
        correctname.style.backgroundColor='green'
        cancelname.style.backgroundColor='red'
        cancelname.addEventListener("click",(e)=>{
            profilename.setAttribute("readonly",true)
            profilename.style.backgroundColor='rgb(188, 188, 186)'
            nameupbtnshow(nameupdiv,profilename,nameupbtndiv)
        })
        
}


function mobileupbtnshow(mobileupdiv,profilemobile,mobileupbtndiv){
    mobileupbtndiv.innerHTML=`
    <button id="mobileup">Update</button>
    `
    let mobileup=document.getElementById("mobileup")
    mobileup.addEventListener('click',(e)=>{
        profilemobile.removeAttribute("readonly")
        profilemobile.style.backgroundColor="white"
         mobileSaveOrCancel(mobileupdiv,profilemobile,mobileupbtndiv)
    })
}

function mobileSaveOrCancel(mobileupdiv,profilemobile,mobileupbtndiv){
    mobileupbtndiv.innerHTML=``
    mobileupbtndiv.innerHTML=`
        <button id="correctmobile"> &#10004;</button>
        <button id="cancelmobile"> &#10006;</button>
        `
        let correctmobile=document.getElementById("correctmobile")
        let cancelmobile=document.getElementById("cancelmobile")
        correctmobile.style.marginRight='5px'
        correctmobile.style.backgroundColor='green'
        cancelmobile.style.backgroundColor='red'
        cancelmobile.addEventListener("click",(e)=>{
            profilemobile.setAttribute("readonly",true)
            profilemobile.style.backgroundColor='rgb(188, 188, 186)'
            mobileupbtnshow(mobileupdiv,profilemobile,mobileupbtndiv)
        })   
}


function statusupbtnshow(statusupdiv,profilestatus,statusupbtndiv){
    statusupbtndiv.innerHTML=`
    <button id="statusup">Update</button>
    `
    let statusup=document.getElementById("statusup")
    statusup.addEventListener('click',(e)=>{
        profilestatus.removeAttribute("readonly")
        profilestatus.style.backgroundColor="white"
         statusSaveOrCancel(statusupdiv,profilestatus,statusupbtndiv)
    })
}

function statusSaveOrCancel(statusupdiv,profilestatus,statusupbtndiv){
    statusupbtndiv.innerHTML=``
    statusupbtndiv.innerHTML=`
        <button id="correctstatus"> &#10004;</button>
        <button id="cancelstatus"> &#10006;</button>
        `
        let correctstatus=document.getElementById("correctstatus")
        let cancelstatus=document.getElementById("cancelstatus")
        correctstatus.style.marginRight='5px'
        correctstatus.style.backgroundColor='green'
        cancelstatus.style.backgroundColor='red'
        cancelstatus.addEventListener("click",(e)=>{
            profilestatus.setAttribute("readonly",true)
            profilestatus.style.backgroundColor='rgb(188, 188, 186)'
            statusupbtnshow(statusupdiv,profilestatus,statusupbtndiv)
        })   
}