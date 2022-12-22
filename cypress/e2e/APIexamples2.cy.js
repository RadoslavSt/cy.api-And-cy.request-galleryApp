/// <reference types = 'cypress'/>

describe('API examples2', ()=>{
    const userCredentials = {
        email: "bobaTest@gmail.com",
        password: "test12345",
      };

    it("Get all my galleries and changed data to the last one", () => {
        const changedData = {
          "title": "changed Title with Api 2",
          description: "changed description by api",
          images: [
            "https://media.istockphoto.com/id/1191223442/photo/lilac-breasted-roller-in-kenya-africa.jpg?b=1&s=170667a&w=0&k=20&c=Nkdvv7lEvTpLa4QZcUQC9krKVxfnfOa89QuNd4FqaNk=",
          ],
        };
    
        cy.api(
          "POST",
          "https://gallery-api.vivifyideas.com/api/auth/login",
          userCredentials
        )
          .its("body")
          .then((body) => {
            console.log(body);
            const token2 = body.access_token;
            cy.log(token2);
    
            cy.request({
              method: "GET",
              url: "https://gallery-api.vivifyideas.com/api/my-galleries?page=1&term=",
              headers: { authorization: "Bearer " + token2 },
            }).then((respGallerys) => {
              console.log(respGallerys);
              cy.log('Trenutni broj mojih galerija je: ' + respGallerys.body.count);
             // cy.log(respGallerys.body.galleries);
    
              cy.log('ID moje najnovije galerije je: ' + respGallerys.body.galleries[0].id);
              const lastGalleryId = respGallerys.body.galleries[0].id;
    
              cy.request({
                method: "PUT",
                url:
                  "https://gallery-api.vivifyideas.com/api/galleries/" +
                  lastGalleryId,
                headers: { authorization: "Bearer " + token2 },
                body: changedData,
              });

             
            });
          });
      });







})