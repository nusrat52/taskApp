 
 const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const greetingUser = (email, name) => {
  const msg = {
    to: email, // Change to your recipient
    from: "nusretibragimli@gmail.com", // Change to your verified sender
    subject: `salamlama, to my testing app`,
    text: `tebrik medirik ki bura qosulubsan at ${name}`,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};

const farewelllUser = (email, name) => {
  const msg = {
    to: email, // Change to your recipient
    from: "nusretibragimli@gmail.com", // Change to your verified sender
    subject: "asking why",
    text: `hi, ${name} we are wondering why you decided to get out of that site`,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};

module.exports = {
  greetingUser,
  farewelllUser,
};
