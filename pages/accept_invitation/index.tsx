import { useEffect } from "react";
import { useRouter } from "next/router";
import { acceptInvitation } from "../../services/gestionDeProjets/GdpAcceptInvitation";
import { isRequestSuccessful } from "../../utils/isRequestSuccessful";
import { message } from "antd";
import { messages } from "../../constants/messages";

export async function getServerSideProps({ query }) {
  if (!query.invitation) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
}

const AcceptInvitiationPage = () => {
  const router = useRouter();
  useEffect(() => {
    if (!router.query.invitation) return;

    const { invitation } = router.query;

    acceptInvitation(invitation as string).then((res) => {
      if (isRequestSuccessful(res.status)) {
        message.success("L'utilisateur a été ajouté à l'affaire.");
      } else {
        message.error(messages.general.error());
      }
      router.push("/");
      return;
    });
  }, [router.query.invitation]);
  return <h1>hello</h1>;
};

export default AcceptInvitiationPage;
