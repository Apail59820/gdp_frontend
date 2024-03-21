import AffairsCerbePage from "../../../src/AffairsCerbePage/AffairsCerbePage";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { GdpAffairModel } from "../../../models/GestionDeProjets/GdpAffairModel";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAffairs,
  setAffairs,
} from "../../../store/reducers/affairsReducer";
import { getGdpAffair } from "../../../services/gestionDeProjets/GdpAffairs";

const CerbeAffairPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const affairId = parseInt(router.query.affairId as string);
  const affairs = useSelector(selectAffairs);

  const [affair, setAffair] = useState<Partial<GdpAffairModel>>({});

  useEffect(() => {
    if (affair) {
      if (affairs.filter((affair) => affair?.id === affairId).length > 0) {
        return setAffair(affairs.filter((affair) => affair.id === affairId)[0]);
      } else {
        getGdpAffair(affairId).then((res) => {
          if (res.status === 200 && res.data) {
            setAffair(res.data);
            dispatch(setAffairs([...affairs, res.data]));
          }
        });
      }
    }
  }, [dispatch, affairId]);

  return <AffairsCerbePage affair={affair} />;
};

export default CerbeAffairPage;
