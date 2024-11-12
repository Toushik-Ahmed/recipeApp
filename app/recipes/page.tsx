import RecipeComp from '@/components/Recipe';

type Props = {};

const page = (props: Props) => {
  return (
    <div className=" flex justify-center bg-[#EBF5FD] h-[full]">
      <RecipeComp />
    </div>
  );
};

export default page;
