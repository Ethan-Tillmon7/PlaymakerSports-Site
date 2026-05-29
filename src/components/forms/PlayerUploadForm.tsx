import { useState } from 'react';
import { useForm, useFieldArray, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { JERSEY_SIZES } from '../../data/apparel';

const playerSchema = z.object({
  player_name: z.string().min(1, 'Required'),
  number: z.coerce.number().int().min(0).max(99, 'Must be 0–99'),
  size: z.enum(JERSEY_SIZES, { error: 'Select a size' }),
});

const schema = z.object({
  team_name: z.string().min(1, 'Required'),
  players: z.array(playerSchema).min(1),
});

type FormValues = {
  team_name: string;
  players: { player_name: string; number: number; size: string }[];
};

const inputClass =
  'w-full border border-pm-rule rounded-xl px-4 h-11 text-[15px] text-pm-ink bg-white focus:outline-none focus:border-pm-black transition-colors duration-150';

export function PlayerUploadForm() {
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: { team_name: '', players: [{ player_name: '', number: 0, size: 'YM' }] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'players' });

  const onSubmit = async (values: FormValues) => {
    setSubmitStatus('idle');
    try {
      const res = await fetch('/api/submit-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'roster', ...values }),
      });
      if (!res.ok) throw new Error();
      setSubmitStatus('success');
      reset();
    } catch {
      setSubmitStatus('error');
    }
  };

  if (submitStatus === 'success') {
    return (
      <div className="border border-pm-success/30 bg-pm-success/5 rounded-xl p-8">
        <span className="font-mono text-[11px] tracking-[0.1em] uppercase text-pm-success">Roster received</span>
        <p className="font-display uppercase text-[22px] leading-[1.1] tracking-[0.005em] mt-2 text-pm-black">
          We've got your roster — we'll be in touch to confirm sizes.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="max-w-[340px]">
        <label className="block font-mono text-[11px] tracking-[0.1em] uppercase text-pm-muted mb-1.5">
          Team name <span className="text-pm-error">*</span>
        </label>
        <input
          {...register('team_name')}
          className={inputClass}
          placeholder="Acadiana Sluggers"
        />
        {errors.team_name && (
          <p className="mt-1 text-[12px] text-pm-error">{errors.team_name.message}</p>
        )}
      </div>

      <div>
        <div className="grid grid-cols-[1fr_80px_100px_36px] gap-3 mb-2">
          <span className="font-mono text-[10.5px] tracking-[0.1em] uppercase text-pm-muted">Player name</span>
          <span className="font-mono text-[10.5px] tracking-[0.1em] uppercase text-pm-muted">Number</span>
          <span className="font-mono text-[10.5px] tracking-[0.1em] uppercase text-pm-muted">Size</span>
          <span />
        </div>

        <div className="space-y-2">
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-[1fr_80px_100px_36px] gap-3 items-start">
              <div>
                <input
                  {...register(`players.${index}.player_name`)}
                  className={inputClass}
                  placeholder="Alex Rodriguez"
                />
                {errors.players?.[index]?.player_name && (
                  <p className="mt-0.5 text-[11px] text-pm-error">
                    {errors.players[index]?.player_name?.message}
                  </p>
                )}
              </div>
              <div>
                <input
                  {...register(`players.${index}.number`)}
                  type="number"
                  min={0}
                  max={99}
                  className={inputClass}
                  placeholder="7"
                />
                {errors.players?.[index]?.number && (
                  <p className="mt-0.5 text-[11px] text-pm-error">
                    {errors.players[index]?.number?.message}
                  </p>
                )}
              </div>
              <div>
                <select {...register(`players.${index}.size`)} className={inputClass}>
                  {JERSEY_SIZES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={() => remove(index)}
                disabled={fields.length === 1}
                className="h-11 w-9 flex items-center justify-center border border-pm-rule rounded-xl text-pm-muted hover:border-pm-ink hover:text-pm-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Remove player"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => append({ player_name: '', number: 0, size: 'YM' })}
          className="mt-3 font-mono text-[11px] tracking-[0.1em] uppercase text-pm-ink border border-pm-rule px-4 h-9 rounded-xl hover:border-pm-black transition-colors"
        >
          + Add player
        </button>
      </div>

      {submitStatus === 'error' && (
        <p className="text-[13px] text-pm-error">
          Something went wrong. Please try again or email us directly.
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="font-display uppercase text-[16px] tracking-[0.04em] bg-pm-yellow text-pm-black px-7 h-11 inline-flex items-center justify-center hover:bg-pm-yellow-deep transition-[colors,transform] duration-150 active:scale-[0.97] border-b-2 border-pm-yellow-deep hover:border-pm-black rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Sending…' : 'Submit roster'}
      </button>
    </form>
  );
}
