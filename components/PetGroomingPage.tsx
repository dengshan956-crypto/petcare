"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type PetType = "cat" | "smallDog" | "mediumDog" | "largeDog";
type ServiceType = "bath" | "spa" | "grooming" | "care";

const basePrices: Record<ServiceType, number> = {
  bath: 98,
  spa: 168,
  grooming: 238,
  care: 48
};

const petAdds: Record<PetType, number> = {
  cat: 30,
  smallDog: 0,
  mediumDog: 40,
  largeDog: 90
};

const petNames: Record<PetType, string> = {
  cat: "猫咪",
  smallDog: "小型犬",
  mediumDog: "中型犬",
  largeDog: "大型犬"
};

const serviceNames: Record<ServiceType, string> = {
  bath: "精致洗护",
  spa: "草本 SPA",
  grooming: "造型修剪",
  care: "洁牙修爪"
};

const services = [
  {
    title: "精致洗护",
    description: "低敏沐浴、护毛素、耳道清洁、足底毛处理、基础吹干。",
    price: "¥98",
    icon: (
      <>
        <path d="M4 14c3-4 5-6 8-6s5 2 8 6" />
        <path d="M5 14h14" />
        <path d="M8 18h8" />
        <path d="M9 10V6" />
        <path d="M15 10V6" />
      </>
    )
  },
  {
    title: "草本 SPA",
    description: "温和清洁、除味护理、皮毛舒缓，适合换季和运动后护理。",
    price: "¥168",
    icon: (
      <>
        <path d="M12 3c4 4 6 7 6 11a6 6 0 0 1-12 0c0-4 2-7 6-11Z" />
        <path d="M9 15c.8 1.4 1.8 2 3 2s2.2-.6 3-2" />
      </>
    )
  },
  {
    title: "造型修剪",
    description: "按品种和生活习惯设计轮廓，含面部、四肢、尾部精修。",
    price: "¥238",
    icon: (
      <>
        <path d="M4 20 20 4" />
        <path d="m14.5 4 5.5 5.5" />
        <path d="M5 8a3 3 0 1 0 6 0 3 3 0 0 0-6 0Z" />
        <path d="M13 16a3 3 0 1 0 6 0 3 3 0 0 0-6 0Z" />
      </>
    )
  },
  {
    title: "洁牙修爪",
    description: "指甲修磨、足部护理、口腔清洁和泪痕护理，可单独加购。",
    price: "¥48",
    icon: (
      <>
        <path d="M7 7h10v10H7z" />
        <path d="M10 4v4" />
        <path d="M14 4v4" />
        <path d="M10 16v4" />
        <path d="M14 16v4" />
        <path d="M4 10h4" />
        <path d="M16 10h4" />
        <path d="M4 14h4" />
        <path d="M16 14h4" />
      </>
    )
  }
];

const gallery = [
  {
    src: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=1100&q=85",
    alt: "洗护后的狗狗",
    caption: "洗护后毛发蓬松，出店前再次梳理"
  },
  {
    src: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=85",
    alt: "两只狗狗在户外",
    caption: "活泼犬只设置短休息间隔"
  },
  {
    src: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=900&q=85",
    alt: "猫咪特写",
    caption: "猫咪独立安静时段"
  },
  {
    src: "https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?auto=format&fit=crop&w=900&q=85",
    alt: "洗澡中的狗狗",
    caption: "低敏洗剂和温水冲洗"
  },
  {
    src: "https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?auto=format&fit=crop&w=900&q=85",
    alt: "美容后的狗狗",
    caption: "修剪造型按生活习惯设计"
  }
];

function getTodayInputValue() {
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  return today.toISOString().slice(0, 10);
}

function formatVisitDate(visitDate: string) {
  const [year, month, day] = visitDate.split("-");
  if (!year || !month || !day) return visitDate;
  return `${year}年${month}月${day}日`;
}

function PawIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M11 20c-2.7 0-5-1.5-5-3.6 0-1.8 2.1-3.1 3.4-4.9.8-1.1 1.3-2.5 2.6-2.5s1.8 1.4 2.6 2.5c1.3 1.8 3.4 3.1 3.4 4.9 0 2.1-2.3 3.6-5 3.6h-2Z" />
      <path d="M5.2 10.5c-.9.2-1.9-.8-2.2-2.2-.3-1.4.3-2.7 1.2-2.9.9-.2 1.9.8 2.2 2.2.3 1.4-.3 2.7-1.2 2.9Z" />
      <path d="M18.8 10.5c.9.2 1.9-.8 2.2-2.2.3-1.4-.3-2.7-1.2-2.9-.9-.2-1.9.8-2.2 2.2-.3 1.4.3 2.7 1.2 2.9Z" />
      <path d="M9.2 7.2c-.8.1-1.6-.8-1.8-2-.2-1.3.3-2.4 1.1-2.5.8-.1 1.6.8 1.8 2 .2 1.3-.3 2.4-1.1 2.5Z" />
      <path d="M14.8 7.2c.8.1 1.6-.8 1.8-2 .2-1.3-.3-2.4-1.1-2.5-.8-.1-1.6.8-1.8 2-.2 1.3.3 2.4 1.1 2.5Z" />
    </svg>
  );
}

function Header() {
  return (
    <header className="topbar">
      <nav className="nav" aria-label="主导航">
        <a className="brand" href="#top" aria-label="泡泡爪宠物洗护店首页">
          <span className="brand-mark" aria-hidden="true">
            <PawIcon />
          </span>
          泡泡爪宠物洗护
        </a>
        <div className="nav-links">
          <a href="#services">服务</a>
          <a href="#process">流程</a>
          <a href="#gallery">环境</a>
          <a href="#reviews">口碑</a>
          <a href="#contact">联系</a>
        </div>
        <a className="nav-cta" href="#booking">
          立即预约
        </a>
      </nav>
    </header>
  );
}

function BookingForm({
  onToast
}: {
  onToast: (message: string) => void;
}) {
  const [petType, setPetType] = useState<PetType>("cat");
  const [serviceType, setServiceType] = useState<ServiceType>("bath");
  const [visitDate, setVisitDate] = useState("");
  const [visitTime, setVisitTime] = useState("10:30");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [minDate, setMinDate] = useState("");

  const price = useMemo(
    () => basePrices[serviceType] + petAdds[petType],
    [petType, serviceType]
  );

  useEffect(() => {
    const today = getTodayInputValue();
    setVisitDate(today);
    setMinDate(today);
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onToast(
      `已收到预约：${petNames[petType]} · ${serviceNames[serviceType]} · ${formatVisitDate(
        visitDate
      )} ${visitTime}，预估 ${price} 元。`
    );
    setPetType("cat");
    setServiceType("bath");
    setVisitDate(minDate || getTodayInputValue());
    setVisitTime("10:30");
    setPhone("");
    setNotes("");
  }

  return (
    <aside className="booking" id="booking" aria-label="预约表单">
      <div className="booking-head">
        <h2>门店预约</h2>
        <p>提交后前台会按所选时间为你预留洗护师。</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="field">
            <label htmlFor="petType">宠物类型</label>
            <select
              id="petType"
              name="petType"
              value={petType}
              onChange={(event) => setPetType(event.target.value as PetType)}
            >
              <option value="cat">猫咪</option>
              <option value="smallDog">小型犬</option>
              <option value="mediumDog">中型犬</option>
              <option value="largeDog">大型犬</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="serviceType">服务项目</label>
            <select
              id="serviceType"
              name="serviceType"
              value={serviceType}
              onChange={(event) =>
                setServiceType(event.target.value as ServiceType)
              }
            >
              <option value="bath">精致洗护</option>
              <option value="spa">草本 SPA</option>
              <option value="grooming">造型修剪</option>
              <option value="care">洁牙修爪</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="field">
            <label htmlFor="visitDate">到店日期</label>
            <input
              id="visitDate"
              name="visitDate"
              type="date"
              min={minDate}
              required
              value={visitDate}
              onChange={(event) => setVisitDate(event.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="visitTime">到店时间</label>
            <select
              id="visitTime"
              name="visitTime"
              value={visitTime}
              onChange={(event) => setVisitTime(event.target.value)}
            >
              <option>10:30</option>
              <option>12:00</option>
              <option>14:00</option>
              <option>16:30</option>
              <option>18:00</option>
              <option>20:00</option>
            </select>
          </div>
        </div>
        <div className="field">
          <label htmlFor="phone">联系电话</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="请输入手机号"
            required
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="notes">特殊情况</label>
          <textarea
            id="notes"
            name="notes"
            placeholder="例如：怕吹风、皮肤敏感、第一次到店"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
        </div>
        <div className="estimate" aria-live="polite">
          <span>预估价格</span>
          <strong>¥{price}</strong>
        </div>
        <button className="btn btn-primary" type="submit">
          提交预约
        </button>
      </form>
    </aside>
  );
}

function Hero({ onToast }: { onToast: (message: string) => void }) {
  return (
    <section className="hero" aria-label="门店预约">
      <div className="hero-grid">
        <div>
          <div className="eyebrow">今日可约 10:30 - 20:30</div>
          <h1>泡泡爪宠物洗护店</h1>
          <p className="hero-copy">
            给猫狗提供透明可见的洗护、美容、除味和基础护理。独立烘干舱、低敏洗剂、先评估后服务，让每一次到店都更省心。
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#booking">
              预约洗护
            </a>
            <a className="btn btn-secondary" href="#services">
              查看套餐
            </a>
          </div>
          <div className="stats" aria-label="门店数据">
            <div className="stat">
              <strong>4.9</strong>
              <span>顾客评分</span>
            </div>
            <div className="stat">
              <strong>35min</strong>
              <span>基础快洗起</span>
            </div>
            <div className="stat">
              <strong>1v1</strong>
              <span>专属洗护师</span>
            </div>
          </div>
        </div>
        <BookingForm onToast={onToast} />
      </div>
    </section>
  );
}

function Services() {
  return (
    <section className="section" id="services">
      <div className="section-inner">
        <div className="section-heading">
          <h2>常用服务一屏看清</h2>
          <p>价格按体型和毛量微调，到店前会先做皮肤、毛结、情绪状态评估。</p>
        </div>
        <div className="service-grid">
          {services.map((service) => (
            <article className="service-card" key={service.title}>
              <span className="icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">{service.icon}</svg>
              </span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <div className="price-line">
                <span>起价</span>
                <strong>{service.price}</strong>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process() {
  const steps = [
    ["01", "入店评估", "确认皮肤、耳朵、毛结和情绪状态，提前说明可能加时或不适合项目。"],
    ["02", "分区洗护", "猫狗分区、用品分开，水温和风力按宠物反应随时调整。"],
    ["03", "护理反馈", "接宠时同步护理建议、掉毛情况和下次到店周期。"]
  ];

  return (
    <section className="section alt" id="process">
      <div className="section-inner split">
        <div className="photo-panel">
          <img
            src="https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?auto=format&fit=crop&w=1100&q=85"
            alt="宠物美容师正在给狗狗梳毛"
          />
        </div>
        <div>
          <div className="section-heading">
            <h2>从进店到接回都有记录</h2>
          </div>
          <div className="process">
            {steps.map(([num, title, description]) => (
              <article className="step" key={num}>
                <div className="step-num">{num}</div>
                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  return (
    <section className="section" id="gallery">
      <div className="section-inner">
        <div className="section-heading">
          <h2>干净、明亮、可等待</h2>
          <p>开放式洗护区配合等候座位，主人能看到关键护理过程。</p>
        </div>
        <div className="gallery">
          {gallery.map((item) => (
            <figure key={item.src}>
              <img src={item.src} alt={item.alt} />
              <figcaption>{item.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Reviews() {
  const reviews = [
    ["我家边牧洗完很蓬松，吹干也彻底。店员会先问皮肤情况，细节做得比较踏实。", "豆豆主人"],
    ["猫咪胆子小，之前洗澡很抗拒。这里安排了安静时段，接回时状态还不错。", "布丁主人"],
    ["修爪和洁牙速度快，价格清楚，预约以后不用排太久。", "可乐主人"]
  ];

  return (
    <section className="section alt" id="reviews">
      <div className="section-inner">
        <div className="section-heading">
          <h2>附近宠物主的真实选择</h2>
          <p>我们更重视稳定的护理体验，而不是一次性的夸张造型。</p>
        </div>
        <div className="reviews">
          {reviews.map(([quote, name]) => (
            <article className="review" key={name}>
              <div className="stars">★★★★★</div>
              <p>{quote}</p>
              <strong>{name}</strong>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="section" id="contact">
      <div className="section-inner">
        <div className="contact-band">
          <div>
            <h2>带它来洗个舒服澡</h2>
            <div className="contact-grid">
              <div className="contact-item">
                <strong>地址</strong>春和路 88 号沿街 102
              </div>
              <div className="contact-item">
                <strong>电话</strong>021-6688-2026
              </div>
              <div className="contact-item">
                <strong>营业</strong>周一至周日 10:00 - 21:00
              </div>
            </div>
          </div>
          <a className="btn btn-secondary" href="#booking">
            选择时间
          </a>
        </div>
      </div>
    </section>
  );
}

function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <div className={`toast${visible ? " show" : ""}`} role="status" aria-live="polite">
      {message}
    </div>
  );
}

export function PetGroomingPage() {
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  function showToast(message: string) {
    setToastMessage(message);
    setToastVisible(true);
  }

  useEffect(() => {
    if (!toastVisible) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setToastVisible(false);
    }, 3600);

    return () => window.clearTimeout(timeout);
  }, [toastMessage, toastVisible]);

  return (
    <>
      <Header />
      <main id="top">
        <Hero onToast={showToast} />
        <Services />
        <Process />
        <Gallery />
        <Reviews />
        <Contact />
      </main>
      <Toast message={toastMessage} visible={toastVisible} />
    </>
  );
}
