import { FavIconBorder, FavIconFill } from "@/constants/icons";

function FavButton({ fav, setFav }) {
  return (
    <div>
      {fav ? (
        <FavIconFill
          onClick={() => setFav(!fav)}
          className="cursor-pointer"
          color={"#5B78C7"}
        />
      ) : (
        <FavIconBorder
          onClick={() => setFav(!fav)}
          className="cursor-pointer"
          color={"#5B78C7"}
        />
      )}
    </div>
  );
}

export default FavButton;
