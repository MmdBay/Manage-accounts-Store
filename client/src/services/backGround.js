// async function backGround() {
//    fetch("/background")
//     .then((response) => {
//       return response.json();
//     })
//     .then((data) => {
//       var backRandom = data[Math.floor(Math.random() * data.length)];
//       const body = document.querySelector("body");
//       body.style.backgroundImage = `url(${backRandom})`
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// }

// export default backGround