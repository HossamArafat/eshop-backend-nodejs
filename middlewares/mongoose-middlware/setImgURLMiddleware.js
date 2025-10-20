const setImageURL = (schema, folderName) => {
  let setImgURL;
  if (folderName == "products") {
    //Mix
    setImgURL = (doc) => {
      if (doc.imageCover) {
        const imageURL = `${process.env.BASE_URL}/${folderName}/${doc.imageCover}`;
        doc.imageCover = imageURL;
      }
      if (doc.images) {
        const imageURLList = [];
        doc.images.forEach((image) => {
          const imageURL = `${process.env.BASE_URL}/${folderName}/${image}`;
          imageURLList.push(imageURL);
        });
        doc.images = imageURLList;
      }
    };
  } else if (folderName == "users") {  //Single
    setImgURL = (doc) => {
      if (doc.profileImg) {
        const imageURL = `${process.env.BASE_URL}/${folderName}/${doc.profileImg}`;
        doc.profileImg = imageURL;
      }
    };
  } else {   //Single
    setImgURL = (doc) => {
      if (doc.image) {
        const imageURL = `${process.env.BASE_URL}/${folderName}/${doc.image}`;
        doc.image = imageURL;
      }
    };
  }

  schema.post("init", (doc) => {
    setImgURL(doc);
  });

  schema.post("save", (doc) => {
    setImgURL(doc);
  });
};

export default setImageURL;
