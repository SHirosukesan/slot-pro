import { fireEvent, render, screen } from '@testing-library/react';
import App from '../App';
import { Thumb, UserImageContext } from '../components/ui';
import { tokyoGhoul } from '../data/machines/tokyoGhoul';

describe('画面', () => {
  beforeEach(() => localStorage.clear());

  it('画像がない機種はテーマ画像、テーマ画像もなければ頭文字の代替表示', () => {
    const { unmount } = render(<Thumb m={tokyoGhoul} />);
    expect(screen.getByTestId('thumb-art')).toBeInTheDocument();
    unmount();
    render(<Thumb m={{ ...tokyoGhoul, machineId: 'slot.smart.unknown.v1' }} />);
    expect(screen.getByTestId('thumb-fallback')).toBeInTheDocument();
  });

  it('端末で設定した画像があれば代替表示より優先', () => {
    render(
      <UserImageContext.Provider value={{ [tokyoGhoul.machineId]: 'data:image/png;base64,AAAA' }}>
        <Thumb m={tokyoGhoul} />
      </UserImageContext.Provider>,
    );
    expect(screen.queryByTestId('thumb-art')).not.toBeInTheDocument();
    expect(screen.getByRole('img', { name: '東京喰種' })).toHaveAttribute('src', 'data:image/png;base64,AAAA');
  });

  it('機種詳細に画像設定ボタンがある', () => {
    render(<App />);
    fireEvent.click(screen.getAllByRole('button', { name: '東京喰種の詳細' })[0]!);
    expect(screen.getByLabelText('東京喰種の画像を設定')).toBeInTheDocument();
  });

  it('クイック判定に5機種が出て、検索で絞り込める', () => {
    render(<App />);
    expect(screen.getByText('東京喰種')).toBeInTheDocument();
    expect(screen.getByText('550〜650G')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('機種名で検索'), { target: { value: 'ほくと' } });
    expect(screen.queryByText('東京喰種')).not.toBeInTheDocument();
    expect(screen.getByText('北斗')).toBeInTheDocument();
  });

  it('機種詳細: 朝一天井の表記・有利区間・リンク未登録', () => {
    render(<App />);
    fireEvent.click(screen.getAllByRole('button', { name: '東京喰種の詳細' })[0]!);
    expect(screen.getByText('朝一天井')).toBeInTheDocument();
    expect(screen.getByText('有利区間', { selector: 'h2' })).toBeInTheDocument();
    expect(screen.getByText('+2,400枚')).toBeInTheDocument();
    expect(screen.getByText('+1,000枚')).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /設定推測/ })).toHaveLength(3);
    const settei = screen.getByRole('link', { name: '設定推測（ななプレス）' });
    expect(settei).toHaveAttribute('href', 'https://nana-press.com/kaiseki/machine/889/27249/');
    expect(settei).toHaveAttribute('target', '_blank');
    expect(settei).toHaveAttribute('rel', 'noopener noreferrer');
    // スルーの仕組みがない機種には出さない
    expect(screen.queryByText('スルー天井')).not.toBeInTheDocument();
  });

  it('据え置きならリセット関連（朝一天井・リセット恩恵・ガックン）を隠し、リセット・不明なら出す', () => {
    render(<App />);
    fireEvent.click(screen.getAllByRole('button', { name: '東京喰種の詳細' })[0]!);
    const pick = (name: string) => fireEvent.click(screen.getByRole('tab', { name }));
    pick('不明');
    expect(screen.getByText('朝一天井')).toBeInTheDocument();
    expect(screen.getByText('リセット恩恵')).toBeInTheDocument();
    pick('据え置き');
    expect(screen.queryByText('朝一天井')).not.toBeInTheDocument();
    expect(screen.queryByText('リセット恩恵')).not.toBeInTheDocument();
    expect(screen.queryByText('ガックン')).not.toBeInTheDocument();
    expect(screen.getByText('宵越し')).toBeInTheDocument();
    pick('リセット');
    expect(screen.getByText('朝一天井')).toBeInTheDocument();
    expect(screen.getByText('ガックン')).toBeInTheDocument();
  });

  it('狙う対象をCZにするとCZの対象機種だけになる', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('tab', { name: 'CZ' }));
    expect(screen.queryByText('北斗')).not.toBeInTheDocument();
    expect(screen.getByText('東京喰種')).toBeInTheDocument();
    expect(screen.getAllByText(/CZ狙い目/).length).toBeGreaterThan(0);
  });

  it('現在G数を入力すると保存される', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'からくりサーカスの現在ゲーム数を入力' }));
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '350' } });
    fireEvent.click(screen.getByRole('button', { name: '決定' }));
    expect(JSON.parse(localStorage.getItem('slotpro:v1:counters')!)['slot.smart.karakuri-circus.v1']).toBe(350);
  });

  it('期待値順に順位外が表示される', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('tab', { name: '期待値順' }));
    expect(screen.getByRole('button', { name: /順位外 2台/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /順位外 \d+台/ }));
    expect(screen.getByText('条件不一致')).toBeInTheDocument();
    expect(screen.getAllByTestId('ev-excluded')[0]).toHaveClass('text-ev');
    // 1ページ5台、2ページ目に6位
    expect(screen.getByRole('list', { name: 'ランキング' }).children).toHaveLength(5);
    expect(screen.getAllByTestId('ev-value')[0]).toHaveClass('text-ev');
    fireEvent.click(screen.getByRole('button', { name: '2ページ目' }));
    expect(screen.getByRole('list', { name: 'ランキング' }).children).toHaveLength(1);
    const values = screen.getAllByTestId('ev-value');
    expect(values[values.length - 1]).toHaveClass('text-prio');
    expect(values[values.length - 1]).toHaveTextContent('−1,200円');
  });

  it('条件に合う期待値がなければ基準に戻すボタンを出す', () => {
    localStorage.setItem('slotpro:v1:evBase', JSON.stringify({ exchangeRate: 5, play: '現金', quitAssumption: '機種別やめどき', closingConsidered: false }));
    render(<App />);
    fireEvent.click(screen.getByRole('tab', { name: '期待値順' }));
    fireEvent.click(screen.getByRole('button', { name: /に戻す/ }));
    expect(screen.getByRole('list', { name: 'ランキング' }).children).toHaveLength(5);
  });
});
