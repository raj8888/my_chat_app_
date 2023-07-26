let signupForm = document.querySelector(".signup-form form");
let toast=document.getElementById("toast")


signupForm.addEventListener("submit",async(e)=>{
    e.preventDefault()
  let name = document.querySelector(".signup-name").value;
  let mobile = document.querySelector(".signup-number").value;
  let email = document.querySelector(".signup-email").value;
  let password = document.querySelector(".signup-password").value;
  let dob=document.querySelector(".dob").value
  let status=document.querySelector(".signup-status").value
  let checkFunc=checkFunctionality(mobile,password,dob,status)
  if(checkFunc==true){
    let obj={
        name,mobile,email,password,dob,status
    }
    newUserReg(obj)
  }else{
    if(checkFunc=="Mobile"){
        swal("ERROR!", "Please Enter Valid Mobil Number!", "error").then(()=>{
            document.querySelector(".signup-number").value=""
        })
    }else if(checkFunc=="DOB"){
        swal("ERROR!", "Please Enter Valid Date Of Birth.\n (It Should not be greater than today's date.)", "error").then(()=>{
            document.querySelector(".dob").value=""
        })
    }else if(checkFunc=="Status"){
        swal("ERROR!", "Please Enter Valid Status!\n(Yes/No)", "error").then(()=>{
            document.querySelector(".signup-status").value=""
        })
    }else if(checkFunc=="Password"){
        swal("ERROR!", "Please Enter Valid Password!\n- Minimum Length of Password should be 8.\n- Maximum Length of Password should be 16.\n- Minimum One upper and One lower letter required.\n- Minimum One special character required.(Ex.#,$,@).\n- Atleast one number should be there.", "error").then(()=>{
            document.querySelector(".signup-password").value=""
        })
    }
  }
})

function checkFunctionality(mobile,password,dob,status){
    status.trim()
    let checkStatus=(status=='yes' || status=='no' || status=='YES' || status=="NO" || status=="Yes" || status=="No")
    const selectedDate = new Date(dob);
    const today = new Date();
    if(mobile.length>10 || mobile.length<10){
        return 'Mobile'
    }else if(! (Number(mobile))){
        return 'Mobile'
    }else if(selectedDate > today){
        return 'DOB'
    }else if(!checkStatus){
        return 'Status'
    }else{
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,16}$/;
        let ans=passwordRegex.test(password)
        if(ans==false){
            return 'Password'
        }
    }
    return true
}

async function newUserReg(obj){
    try {
        let url=await fetch("http://localhost:8000/user/register",{
        method:"POST",
        headers:{
            "Content-Type": "application/json"
        },
        body:JSON.stringify(obj)
    })

    if(url.status==400 || url.status==401){
        let serverRes=await url.json()
        await swal("ERROR!", `${serverRes.message}`, "error");
    }else{
        await swal("Signup Successful!", "You are now Registered!", "success");
        window.location="login.html"
    }
    } catch (error) {
        console.log(error.message)
        await swal("Server Error!", "Sorry :(, There is error in Server!", "error");
    }
}


let login=document.querySelector(".login-form form")
login.addEventListener("submit", async(e)=>{
    e.preventDefault()
    let email= document.querySelector('.login-email').value;
    let password= document.querySelector('.login-password').value;

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,16}$/;
    let ans=passwordRegex.test(password)

    if(ans){
        let obj={
            email,
            password
        }
        userLogin(obj)
    }else{
        swal("ERROR!", "Please Enter Valid Password!\n- Minimum Length of Password should be 8.\n- Maximum Length of Password should be 16.\n- Minimum One upper and One lower letter required.\n- Minimum One special character required.(Ex.#,$,@).\n- Atleast one number should be there.", "error").then(()=>{
            document.querySelector(".login-password").value=""
        })
    }
})

async function userLogin(obj){
    try {
        let url=await fetch("http://localhost:8000/user/login",{
        method:"POST",
        headers:{
            "Content-Type": "application/json"
        },
        body:JSON.stringify(obj)
    })

    if(url.status==400 || url.status==401){
        let serverRes=await url.json()
        await swal("ERROR!", `${serverRes.message}`, "error");
    }else{
        let serverRes=await url.json()
        localStorage.setItem("rajChatAppToken",JSON.stringify(serverRes.userEmail))
        await swal("Login Successful!", "You login successfully!", "success");
        window.location='main.html'
    }
    } catch (error) {
        console.log(error.message)
        await swal("Server Error!", "Sorry :(, There is error in Server!", "error");
    }
}



