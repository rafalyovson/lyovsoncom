async function Page({ params }: { params: { username: string } }) {
  console.log('params', params);
  // const username = params.username;
  // const result = await userSelectFullOneByUsername({
  //   username,
  // });

  // if (!result.success || !result.user) {
  //   redirect('/');
  //
  // }
  return (
    <h1 className={`text-2xl text-center`}>
      {/*{`${result.user.name}'s Portfolio`}*/}
      Portfolio
    </h1>
  );
}

export default Page;
