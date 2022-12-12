/// <reference types = 'cypress'/>

describe("API Log In, Create Gallery and Comment", () => {
  const userCredentials = {
    email: "bobaTest@gmail.com",
    password: "test12345",
  };

  it("Log in,create new gallery and add a comment", () => {
    const createArticle = {
      title: "api Article",
      description: "APi description",
      images: [
        "https://freesvgplanet.com//wp-content//uploads//2019//10//pokemon-svg-free-30195-758x505.jpg",
      ],
    };

    cy.api(
      "POST",
      "https://gallery-api.vivifyideas.com/api/auth/login",
      userCredentials
    )
      .its("body")
      .then((body) => {
        const tokenConst = body.access_token;
        console.log(body);

        cy.request({
          method: "POST",
          url: "https://gallery-api.vivifyideas.com/api/galleries",
          headers: { authorization: "Bearer " + tokenConst },
          body: createArticle,
        }).then((responsive) => {
          console.log(responsive);
          expect(responsive.status).eq(201);
          expect(responsive.statusText).eq("Created");
          cy.log(responsive.body.id);
          const galleryID = responsive.body.id;

          cy.request({
            method: "POST",
            url: "https://gallery-api.vivifyideas.com/api/comments",
            headers: { authorization: "Bearer " + tokenConst },
            body: {
              gallery_id: galleryID,
              body: "api comments on the last created gallery",
            },
          }).then((responsiveComment) => {
            expect(responsiveComment.status).eq(200);
          });
        });
      });
  });

  it("Get my galleries and changed the last one", () => {
    const changedData = {
      title: "changed Title by Api",
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
          cy.log(respGallerys.body.count);
          cy.log(respGallerys.body.galleries);

          cy.log(respGallerys.body.galleries[0].id);
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
});
