"use client";

interface MediaSocialProps {
  youtubeVideoId?: string;
  instagramUsername?: string;
  instagramUrl?: string;
}

export default function MediaSocialSection({
  youtubeVideoId = "0ziMD3tq-AM",
  instagramUsername = "rumahamal.usk",
  instagramUrl = "https://www.instagram.com/rumahamal.usk/",
}: MediaSocialProps) {
  const embedYoutubeUrl = `https://www.youtube.com/embed/${youtubeVideoId}?si=KY0tpBH6XZe1FurM`;

  return (
    <section className="w-full max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">

        {/* YouTube */}
        <div className="lg:col-span-8 flex flex-col">
          <div className="relative w-full h-full min-h-[320px] sm:min-h-[400px] md:min-h-[460px] bg-black rounded-2xl overflow-hidden shadow-lg border border-gray-200">
            <iframe
              src={embedYoutubeUrl}
              title="YouTube video player"
              className="w-full h-full absolute inset-0 border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>

        {/* Instagram embed */}
        <div className="lg:col-span-4 flex flex-col">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-4 sm:p-5 flex flex-col gap-3 h-full min-h-[440px]">



            {/* Instagram profile embed */}
            <div className="flex-1 rounded-xl overflow-hidden border border-gray-100">
              <iframe
                src="https://www.instagram.com/rumahamal.usk/embed"
                frameBorder={0}
                title="Instagram RA USK"
                loading="lazy"
                className="w-full h-full border-0"
                style={{ minHeight: "380px" }}
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
