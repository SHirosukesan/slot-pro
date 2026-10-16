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
    expect(screen.getByTestId('link-settei-missing')).toHaveTextContent('リンク未登録');
    // スルーの仕組みがない機種には出さない
    expect(screen.queryByText('スルー天井')).not.toBeInTheDocument();
  });

  it('現在G数を入力すると保存される', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'からくりサーカスの現在G数を入力' }));
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '350' } });
    fireEvent.click(screen.getByRole('button', { name: '決定' }));
    expect(JSON.parse(localStorage.getItem('slotpro:v1:counters')!)['slot.smart.karakuri-circus.v1']).toBe(350);
  });

  it('期待値順に順位外が表示される', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('tab', { name: '期待値順' }));
    expect(screen.getByText('順位外')).toBeInTheDocument();
    expect(screen.getByText('条件不一致')).toBeInTheDocument();
    const values = screen.getAllByTestId('ev-value');
    expect(values[0]).toHaveClass('text-go');
    expect(values[values.length - 1]).toHaveClass('text-prio');
    expect(values[values.length - 1]).toHaveTextContent('−1,200円');
  });
});
