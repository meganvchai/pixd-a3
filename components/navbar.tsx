import Image from 'next/image'

export default function Navbar() {
  return (
    <nav
      style={{
        position: 'fixed',
        top: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '12px 20px',
          background: 'white',
          borderRadius: '4px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        }}
      >
        <Image
          src="/asterisk.svg"
          alt="Asterisk"
          width={24}
          height={24}
          style={{ marginRight: '12px' }}
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '8px',
          }}
        >
          <span style={{ fontWeight: 500, fontSize: '20px' }}>Megan's</span>
          <span style={{ fontStyle: 'italic', fontSize: '20px' }}>Archive</span>
        </div>
      </div>
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: '#FFC2EC',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
        }}
      >
        ?
      </div>
    </nav>
  )
} 