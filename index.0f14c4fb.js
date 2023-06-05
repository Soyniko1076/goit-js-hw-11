!function(o){const t=new URLSearchParams({key:"37053525-954bf5b1abb6340838a01bbc5",q:o,image_type:photo,orientation:horizontal,safesearch:!0});fetch(`https://pixabay.com/api/?${t}`).then((o=>{if(!o.ok)throw new Error(o.status);return o.json()})).catch((o=>console.log(o)))}("dog");
//# sourceMappingURL=index.0f14c4fb.js.map
