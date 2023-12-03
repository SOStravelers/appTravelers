import { FavIconBorder, FavIconFill } from "@/constants/icons";

function FavButton({ isFavorite, handleSetFav, handleDeleteFav }) {
  return (
    <div>
      {isFavorite ? (
        <FavIconFill
          onClick={handleDeleteFav}
          className="cursor-pointer"
          color={"#5B78C7"}
        />
      ) : (
        <FavIconBorder
          onClick={handleSetFav}
          className="cursor-pointer"
          color={"#5B78C7"}
        />
      )}
    </div>
  );
}

export default FavButton;
