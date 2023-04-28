import ChichatLabel from './ChichatLabel'

export default function BackgroudChichat() {
  return (
    <div className="relative -mt-10">
      <div className="flex gap-[10px] mb-[10px] relative right-10">
        <ChichatLabel classNameOverride="bg-[#18A9FA]/10" />
        <ChichatLabel classNameOverride="bg-[#163647]/10" />
        <ChichatLabel classNameOverride="bg-[#806666]/10" />
        <ChichatLabel classNameOverride="bg-[#18A9FA]/10" />
      </div>
      <div className="flex gap-[10px] mb-[10px]">
        <ChichatLabel classNameOverride="bg-[#806666]/10" />
        <ChichatLabel classNameOverride="bg-[#163647]/10" />
        <ChichatLabel classNameOverride="bg-[#18A9FA]/10" />
        <ChichatLabel classNameOverride="bg-[#806666]/10" />
      </div>
      <div className="flex gap-[10px] mb-[10px] relative right-10">
        <ChichatLabel classNameOverride="bg-[#18A9FA]/10" />
        <ChichatLabel classNameOverride="bg-[#806666]/10" />
        <ChichatLabel classNameOverride="bg-[#163647]/10" />
        <ChichatLabel classNameOverride="bg-[#18A9FA]/10" />
      </div>
      <div className="flex gap-[10px] mb-[10px]">
        <ChichatLabel classNameOverride="bg-[#163647]/10" />
        <ChichatLabel classNameOverride="bg-[#18A9FA]/10" />
        <ChichatLabel classNameOverride="bg-[#806666]/10" />
        <ChichatLabel classNameOverride="bg-[#163647]/10" />
      </div>
      <div className="flex gap-[10px] mb-[10px] relative right-10">
        <ChichatLabel classNameOverride="bg-[#18A9FA]/10" />
        <ChichatLabel classNameOverride="bg-[#806666]/10" />
        <ChichatLabel classNameOverride="bg-[#163647]/10" />
        <ChichatLabel classNameOverride="bg-[#18A9FA]/10" />
      </div>
      <span
        className="absolute w-full h-full top-0"
        style={{
          background:
            'linear-gradient(0deg, #FFFFFF 0%, rgba(255, 255, 255, 0) 97.42%), linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0) 38.4%)',
        }}></span>
    </div>
  )
}
