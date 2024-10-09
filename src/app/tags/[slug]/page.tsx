const Page = async (props: { params: Promise<{ slug: string }> }) => {
  const params = await props.params;
  const { slug } = await params;

  return <h1>Tag: {slug}</h1>;
};

export default Page;
