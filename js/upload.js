// Define processing URL and form element
const url = '/Web/api/index.php';
const form = document.querySelector('form');
// Listen for form submit
form.addEventListener('submit', e => {
   e.preventDefault();
 // Gather files and begin FormData
   const files = document.querySelector('[type=file]').files;
   const formData = new FormData();
// Append files to files array
   for (let i = 0; i < files.length; i++) {
       let file = files[i];

       formData.append('files[]', file);
   }

   fetch(url, {
       method: 'POST',
       body: formData
   }).then(response => {
       console.log(response);
   });
});