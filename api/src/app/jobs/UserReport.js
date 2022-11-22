export default {
  key: "ReportMail",
  async handle({ data }) {
    const { user } = data;
    console.log(user);
  },
};
