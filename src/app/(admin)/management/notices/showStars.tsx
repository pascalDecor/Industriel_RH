import clsx from "clsx";
import { AiFillStar } from "react-icons/ai";

export default function ShowStars({ star }: { star: number }) {

    const stars = [1, 2, 3, 4, 5];

    return <div className="flex items-center space-x-2">
        {stars.map((s, i) =>
            <AiFillStar key={i} className={clsx("text-slate-300 text-xl cursor-pointer", star >= s && "text-yellow-500")} />)}
    </div>
}     