 function newTableLine(elem){
    const {largeUrl, smallUrl} = elem;
    const block= document.createElement('tr');
    const lUrl = document.createElement('td');
    const sUrl = document.createElement('td');
    let a =document.createElement('a');
    block.className = 'url-table-string';
    lUrl.className = 'url-long';
    sUrl.className = 'url-short';
    a.href = largeUrl;
    lUrlText = document.createTextNode(largeUrl);
    sUrlText = document.createTextNode(smallUrl);
    a.appendChild(lUrlText);
    lUrl.appendChild(a);
    a =document.createElement('a');
    a.href = largeUrl;
    a.appendChild(sUrlText);
    sUrl.appendChild(a);
    block.appendChild(lUrl);
    block.appendChild(sUrl);
    document.getElementById(`url-table`).appendChild(block);
 }

async function createTable (){
    const response = await fetch('http://localhost:3000/tableData'); 
    const resJson = await response.json();
    resJson.map(elem =>{
        newTableLine(elem);
    })
}
async function newUrl() {
    function validateUrl(value) {
    const urlPattern = new RegExp('^(https?:\\/\\/)?'+ 
	    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ 
	    '((\\d{1,3}\\.){3}\\d{1,3}))'+ 
	    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+
	    '(\\?[;&a-z\\d%_.~+=-]*)?'+
	    '(\\#[-a-z\\d_]*)?$','i');
        return !!urlPattern.test(value);
}
    let largeUrl = document.getElementById('url-for-shortner').value;
    if (validateUrl(largeUrl)){
    const res = await fetch("/newUrl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({ largeUrl }),
      });
      const profile = await res.json();
      newTableLine(profile);
      document.getElementById('url-for-shortner').value ='';
     } else{
        alert('incorrect Url')
     }
    
}
